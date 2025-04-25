const express = require("express");
const pool = require("../db");
const router = express.Router();
const { getRecommendedJobs }= require('../controllers/jobsController');
const isAuthenticated = require('../middleware/isAuthenticated');

// Fetch jobs from the database with search functionality
router.get("/jobs", async (req, res) => {
  try {
    
    const searchQuery = req.query.search || "";
    const result = await pool.query(
      `SELECT * FROM jobs WHERE LOWER(title) LIKE LOWER($1) OR LOWER(company) LIKE LOWER($1)`,
      [`%${searchQuery}%`]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

router.get("/recommended", isAuthenticated, getRecommendedJobs);

module.exports = router;