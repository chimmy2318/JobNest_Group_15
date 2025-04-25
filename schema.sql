
-- Table: accounts
CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255),
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    google_id TEXT,
    email VARCHAR(255) NOT NULL UNIQUE
);

-- Table: jobs
CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    title TEXT,
    company TEXT,
    location TEXT,
    salary TEXT,
    description TEXT,
    url TEXT UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    label VARCHAR,
    tag VARCHAR,
    skills TEXT
);

-- Table: users (profile info linked to accounts)
CREATE TABLE users (
    id INTEGER PRIMARY KEY REFERENCES accounts(id),
    name VARCHAR(255),
    skills TEXT,
    email VARCHAR(255),
    education JSONB[],
    enable BOOLEAN DEFAULT true
);

-- Table: saved_jobs
CREATE TABLE saved_jobs (
    user_id INTEGER NOT NULL REFERENCES accounts(id),
    job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, job_id)
);

-- Table: appliedjobs
CREATE TABLE appliedjobs (
    id SERIAL PRIMARY KEY,
    company VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    user_id INTEGER NOT NULL REFERENCES accounts(id),
    dateapplied TIMESTAMP NOT NULL,
    datemodified TIMESTAMP NOT NULL
);