const express = require("express");
const router = express.Router();
const db = require("../db");
//const { SavedJob } = require("../models/SavedJob");
const  isAuthenticated = require("../middleware/isAuthenticated"); // Assumes you have auth middleware

// Save a job
router.post('/save',isAuthenticated, async (req, res) => {
    const userId = req.user.id;
  const { jobId } = req.body;

  try {
    // Check if already saved
    const existing = await db.query(
      'SELECT * FROM saved_jobs WHERE user_id = $1 AND job_id = $2',
      [userId, jobId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Job already saved' });
    }

    // Insert
    await db.query(
      'INSERT INTO saved_jobs (user_id, job_id) VALUES ($1, $2)',
      [userId, jobId]
    );

    res.status(201).json({ message: 'Job saved successfully' });
  } catch (err) {
    console.error('Error saving job:', err);
    res.status(500).json({ error: 'Server error' });
  }
});
{/*
// Get all saved jobs for a user
router.get("/saved",isAuthenticated, async (req, res) => {
  const user = req.user || req.session.user;
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userId = user.id;
  try {
    // Get job_ids saved by the user
    const savedJobIdsResult = await db.query(
      "SELECT job_id FROM saved_jobs WHERE user_id = $1",
      [userId]
    );

    const jobIds = savedJobIdsResult.rows.map((row) => row.job_id);

    if (jobIds.length === 0) {
      return res.json([]); // No saved jobs
    }

    // Fetch job details for those job_ids
    const jobsResult = await db.query(
      `SELECT * FROM jobs WHERE id = ANY($1::int[])`,
      [jobIds]
    );

    res.json(jobsResult.rows);
  } catch (err) {
    console.error("Error fetching saved jobs:", err);
    res.status(500).json({ error: "Server error" });
  }
});*/}

// Get all saved jobs for a user with optional filters
router.get("/saved", isAuthenticated, async (req, res) => {
  const user = req.user || req.session.user;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = user.id;
  const searchTerm = (req.query.search || "").toLowerCase();
  const locationTerm = (req.query.location || "").toLowerCase();
  const companyTerm = (req.query.company || "").toLowerCase();
  

  try {
    const savedJobIdsResult = await db.query(
      "SELECT job_id FROM saved_jobs WHERE user_id = $1",
      [userId]
    );
    const jobIds = savedJobIdsResult.rows.map((row) => row.job_id);
    if (jobIds.length === 0) {   
      return res.json([]); // No saved jobs
    }
    // Step 2: Fetch full job details for those IDs
    const jobsResult = await db.query(
      `SELECT * FROM jobs WHERE id = ANY($1::int[])`,
      [jobIds]
    );
    const jobs = jobsResult.rows;

    // Step 3: Filter jobs in memory (like frontend filtering)
    const filteredJobs = jobs.filter((job) => {
      const title = job.title?.toLowerCase() || "";
      const desc = job.description?.toLowerCase() || "";
      const loc = job.location?.toLowerCase() || "";
      const comp = job.company?.toLowerCase() || "";

      const searchMatch =
        !searchTerm || title.includes(searchTerm) || desc.includes(searchTerm);

      const locationMatch =
        !locationTerm || loc.includes(locationTerm);

      const companyMatch =
        !companyTerm || comp.includes(companyTerm);

      return searchMatch && locationMatch && companyMatch;
    });

    res.json(filteredJobs);
  } catch (err) {
    console.error("Error fetching saved jobs:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// DELETE /api/saved-jobs/unsave/:jobId
router.delete("/unsave/:jobId", isAuthenticated, async (req, res) => {
  const userId = req.user.id;
  const { jobId } = req.params;  // Access jobId from URL params
  
  if (!userId || !jobId) {
    return res.status(400).json({ error: "Missing userId or jobId" });
  }

  try {
    const result = await db.query(
      "DELETE FROM saved_jobs WHERE user_id = $1 AND job_id = $2 RETURNING *",
      [userId, jobId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Job not found in saved jobs." });
    }

    res.status(200).json({ message: "Job unsaved successfully." });
  } catch (err) {
    console.error("Error unsaving job:", err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;