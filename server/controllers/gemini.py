import os
import requests

GROQ_API_KEY = "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"

def classify_email_status_with_groq(email_body):
    prompt = f"""
You are a helpful assistant that classifies job application emails.

Based on the following email content, classify the job application status as one of these:
- applied
- rejected
- interview
- offer
- online assessment
- group discussion
- case study challenge
- unknown

Email:
\"\"\"
{email_body}
\"\"\"

Reply with only one word from this list:applied, rejected, interview, offer, online assessment, group discussion, case study challenge, or unknown.
"""

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    data = {
        "model": "llama3-70b-8192",
        "messages": [
            {"role": "system", "content": "You are an email classifier for job applications."},
            {"role": "user", "content": prompt}
        ]
    }

    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers,
            json=data
        )
        response.raise_for_status()
        status = response.json()["choices"][0]["message"]["content"].strip().lower()
        allowed_statuses = [
            "rejected", "interview", "offer",
            "online assessment", "group discussion",
            "case study challenge", "unknown","applied"
        ]
        return status if status in allowed_statuses else "unknown"

    except Exception as e:
        print(f"Groq API error: {e}")
        return "unknown"
    