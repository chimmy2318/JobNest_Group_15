const pool = require("../db");

// Create jobs table if it doesn't exist
const createJobsTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS jobs (
      id SERIAL PRIMARY KEY,
      title TEXT,
      company TEXT,
      location TEXT,
      salary TEXT,
      description TEXT,
      url TEXT UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

// Insert job into database, avoiding duplicates
const insertJob = async (job) => {
  try {
    const result = await pool.query(
      `INSERT INTO jobs (title, company, location, salary, description, url)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (url) DO NOTHING`,
      [job.title, job.company, job.location, job.salary, job.description, job.url]
    );

    if (result.rowCount > 0) {
      console.log(`Inserted job: ${job.title}`); // Fixed template string syntax
    } else {
      console.log(`Skipped duplicate job: ${job.title}`); // Fixed template string syntax
    }
  } catch (error) {
    console.error("Error inserting job:", error);
  }
};

module.exports = { createJobsTable, insertJob };

