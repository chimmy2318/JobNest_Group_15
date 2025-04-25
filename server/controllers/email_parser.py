from __future__ import print_function
import sys
import json
import os.path
import base64
import re
from bs4 import BeautifulSoup
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from gemini import classify_email_status_with_groq

if len(sys.argv) < 2:
    print(json.dumps({ "error": "No input provided" }))
    sys.exit(1)
# Parse the escaped JSON string
escaped_json = sys.argv[1]
jobs = json.loads(escaped_json)

# Configuration
SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']
MAX_EMAILS = 50  # Reduced for better testing



def get_gmail_service():
    """Authenticate with Gmail API"""
    creds = None
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file('/Users/kurleprajesh/Downloads/jobNest_copy/server/controllers/credentials.json', SCOPES)

            creds = flow.run_local_server(port=0)
        
        with open('token.json', 'w') as token:
            token.write(creds.to_json())

    return build('gmail', 'v1', credentials=creds)

def extract_email_body(payload):
    """Extract and clean email body text"""
    def get_part_text(part):
        data = part['body'].get('data', '')
        if not data:
            return ''
        text = base64.urlsafe_b64decode(data).decode('utf-8')
        if part['mimeType'] == 'text/html':
            soup = BeautifulSoup(text, 'html.parser')
            text = soup.get_text('\n')
        return text

    text = ""
    if 'parts' in payload:
        for part in payload['parts']:
            if part['mimeType'] in ['text/plain', 'text/html']:
                text += get_part_text(part) + "\n"
    else:
        text = get_part_text(payload)
    
    # Basic cleaning
    text = re.sub(r'http\S+|www\S+', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text.lower()





def is_application_email(email, app):
    """More robust email matching"""
    company = app['company'].lower().strip()
    role = app['role'].lower().strip()
    content = f"{email['subject']} {email['body']}".lower()
    
    # More flexible matching patterns
    company_pattern = rf'(^|\W){re.escape(company)}($|\W)'
    role_pattern = rf'(^|\W){re.escape(role)}($|\W)'
    
    company_match = re.search(company_pattern, content)
    role_match = re.search(role_pattern, content)
    
    return bool(company_match) and bool(role_match)

def is_application_emaii(email, app):
    """Check if the email content contains the company and role strings (simplified)"""
    company = app['company']
    role = app['role']
    content = f"{email['subject']} {email['body']}"

    return company in content and role in content


def process_emails(service):
    """Fetch and process emails"""
    try:
        results = service.users().messages().list(
            userId='me',
            labelIds=['INBOX'],
            maxResults=MAX_EMAILS
        ).execute()
        messages = results.get('messages', [])
        
        processed = []
        for msg in messages:
            try:
                message = service.users().messages().get(
                    userId='me',
                    id=msg['id'],
                    format='full'
                ).execute()
                
                headers = message['payload']['headers']
                subject = next(
                    (h['value'] for h in headers if h['name'] == 'Subject'), 
                    'No Subject'
                )
                from_email = next(
                    (h['value'] for h in headers if h['name'] == 'From'), 
                    'Unknown Sender'
                )
                date = next(
                    (h['value'] for h in headers if h['name'] == 'Date'), 
                    'Unknown Date'
                )
                
                body = extract_email_body(message['payload'])
                
                processed.append({
                    'id': msg['id'],
                    'subject': subject,
                    'from': from_email,
                    'date': date,
                    'body': body
                })
            except Exception as e:
                print(f"Error processing email: {str(e)[:100]}...")
                continue
        return processed
    except Exception as e:
        print(f"Error fetching emails: {e}")
        return []

def main():
    service = get_gmail_service()
    if not service:
        print("Failed to authenticate with Gmail.")
        return
    
    emails = process_emails(service)
    status_result = []

    for app in jobs:
      matched_status = 'unknown'
    
    # Process emails for each job application
      for email in emails:
        if is_application_email(email, app):      
           matched_status = classify_email_status_with_groq(email['body'])
           break  # Stop checking further emails once a match is found
    
    # After checking all emails, append the result for this job
      status_result.append({
        'company': app['company'],
        'role': app['role'],
        'status': matched_status
      })

# This is your existing final output line
    print(json.dumps(status_result, indent=2))

if __name__ == '__main__':
    main()