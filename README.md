# JobNest Platform

JobNest is a full-stack job board platform that offers a seamless experience for job seekers. It features secure user authentication (including Google OAuth), job search with advanced filtering, the ability to save and track job applications, and automated email parsing to update application statuses directly from your inbox. Built with a modern tech stack, it combines an intuitive frontend with a powerful backend and a PostgreSQL database to deliver personalized and efficient job-hunting support.

---

## 1. Setup Instructions

1. First, clone the repository to your local machine:

 ```bash
 git clone https://github.com/your-username/your-repo-name.git
 cd your-repo-name

 ```

2. Install Dependencies

 - Backend (Server)

   Navigate to the server folder and install the required dependencies:
 ```bash
 cd server
 npm install
 ```
 - Frontend (Client)

   Navigate to the client folder and install the required dependencies:
 ```bash
 cd ../client
 npm install

 ```

3. Start the Development Servers

- Start Backend

  In the backend folder, run the following command to start the server:
```bash
cd ../server
node index.js
```
- Start Frontend

  In a separate terminal, navigate to the client folder and start the frontend:
```bash
cd ../client
npm start
```
  Now, the backend should be running on http://localhost:6005 and the frontend should be running on http://localhost:3000.

---

## 2. Database Setup

1. Install PostgreSQL

    Ensure that PostgreSQL is installed on your local machine. If not, follow the installation guide for your operating system.
    https://www.postgresql.org/download/

2. Set Up Database
    - Log in to PostgreSQL:

    ```bash
     psql -U postgres
    ```

	- Create a new database for the project: 

    ```bash
    CREATE DATABASE job_nest;
    ```

	- Switch to the newly created database:

    ```bash
    \c job_nest
    ```

	- Run the provided SQL schema file to create all necessary tables. Make sure you have a schema.sql file that contains the full schema for the tables required by the platform. You can run the schema file using the following command:

    ```bash
    \i ./schema.sql
    ```

    This will set up all the tables for your application.

---

## 3. Environment Variables

  - Create a .env file in the root directory of the backend to store environment-specific variables.

  Backend (server/.env)
 ```bash
  # PostgreSQL Configuration
  DB_USER=your_postgres_username
  DB_HOST=localhost
  DB_NAME=your_database_name
  DB_PASS=your_postgres_password
  DB_PORT=5432

  # Server Configuration
  PORT=6005
  SESSION_SECRET=your_session_secret

  # Google OAuth
  GOOGLE_CLIENT_ID=your_google_client_id
  GOOGLE_CLIENT_SECRET=your_google_client_secret

  # Groq API
  GROQ_API_KEY=your_groq_api_key

  # Adzuna API
  ADZUNA_API_URL=https://api.adzuna.com/v1/api/jobs/in/search/
  APP_ID=your_adzuna_app_id
  APP_KEY=your_adzuna_app_key
  MAX_ADZUNA_PAGES=2

  # Findwork API
  FINDWORK_API_KEY=your_findwork_api_key
  FINDWORK_API_URL=https://findwork.dev/api/jobs/

  # Remotive API
  REMOTIVE_API=https://remotive.com/api/remote-jobs

  # LinkedIn API (via RapidAPI)
  LINKEDIN_API_URL=https://linkedin-job-search-api.p.rapidapi.com/active-jb-24h
  LINKEDIN_API_KEY=your_rapidapi_key
  LINKEDIN_API_HOST=linkedin-job-search-api.p.rapidapi.com
  ```

  - Replace all placeholder values (your_...) with your actual credentials. You will need to configure your Google OAuth credentials for login functionality. Additionally, make sure to update the values for the Adzuna, LinkedIn, Findwork, and Remotive APIs with your respective keys and URLs.

---

## 4. Usage

Once everything is set up, you can use the platform as follows:
  -	Sign Up/Login using Google OAuth.
  -	Homepage gives access to all features and user profile.
  -	Profile: Add skills, manage email parsing preferences.
  -	Find Jobs: Browse jobs from APIs, filter, save, and apply.
  -	Saved & Recommended Jobs: View saved jobs or jobs based on your skills.
  -	Apply Now: Redirects to job link, then logs application to tracker.
  -	Resume Optimizer: Upload resume and job description to get ATS tips and score.
  - Track Applications: Manually or via email parsing; filter by status and date.

---

## 5. Notes
  - Links for keys :
    - LinkedIn - https://rapidapi.com/fantastic-jobs-fantastic-jobs-default/api/linkedin-job-search-api/playground/apiendpoint_628cadc4-501b-4b98-ab46-46cace51d899
    - Adzuna - https://developer.adzuna.com/admin/access_details
    - FindWork - https://findwork.dev/developers/
    - Groq API - https://console.groq.com/keys
    - Goole Client Credentials - https://console.developers.google.com/apis/credentials
  - For generating session secret key run this in your terminal
   ```bash
    node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ``` 
  -	The email parsing feature is disabled by default, and can be enabled through the profile settings after logging in.
  - Ensure your PostgreSQL database is set up with the provided schema for all features to work correctly.

--- 
## 6. Troubleshooting

  -	Confirm the backend server is running.
  -	Verify API URLs are correctly set in the frontend.
  -	Ensure PostgreSQL is active and accessible.
  -	Import the schema into the database (job_board).
  -	Double-check your .env file has a valid SESSION_SECRET.
  -	Ensure Google OAuth credentials are correct and registered.

If you’re still facing issues, feel free to open an issue on the GitHub repository.

