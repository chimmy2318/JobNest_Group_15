const express = require("express");
const axios = require("axios");
const passport = require("passport");
const path = require('path'); 
const { exec } = require('child_process');
const scriptPath = path.join(__dirname, '../controllers/email_parser.py');
const { loginUser, signupUser, loginSuccess, logoutUser } = require("../controllers/authController");

const router = express.Router();

// Traditional
router.post("/login", loginUser);
router.post("/signup", signupUser);
router.get("/login/sucess", loginSuccess);
router.get("/logout", logoutUser);

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
/*
router.get("/google/callback", passport.authenticate("google", {
  successRedirect: "http://localhost:3000/home",
  failureRedirect: "http://localhost:3000/auth"
}));

module.exports = router;

*/
const pool = require("../db"); // Assuming you’re using pg and have this set up



const fetchAndUpdateJobs = async (userId) => {
  try {
    const sortBy = "dateModified";
    const order = "DESC";

        // Validating the sort and order parameters
        const validSortFields = ['company', 'role', 'status', 'dateApplied', 'dateModified'];
        const validOrders = ['ASC', 'DESC'];

        if (!validSortFields.includes(sortBy) || !validOrders.includes(order.toUpperCase())) {
            return res.status(400).json({ error: 'Invalid sort parameters' });
        }

    const query = `
      SELECT * FROM appliedjobs
      WHERE user_id = $1
      ORDER BY ${sortBy} ${order};
    `;
    const result = await pool.query(query, [userId]);
    const jobs = result.rows;

    const jobsJSON = JSON.stringify(jobs).replace(/"/g, '\\"');
    const command = `python3 ${scriptPath} "${jobsJSON}"`;
    
    exec(command,  async (err, stdout, stderr) => {
      if (err) {
        console.error(`Error executing script: ${err}`);
        return;
      }
      try {
        const emailStatuses = JSON.parse(stdout);
        for (const job of jobs) {
          const match = emailStatuses.find(
            (entry) =>
              entry.company.toLowerCase() === job.company.toLowerCase() &&
              entry.role.toLowerCase() === job.role.toLowerCase()
          );
          if (match && match.status !== "unknown") {
            await pool.query(
              `UPDATE appliedjobs
               SET status = $1, dateModified = NOW()
               WHERE user_id = $2 AND company = $3 AND role = $4`,
              [match.status, userId, job.company, job.role]
            );
            console.log(`Updated job: ${job.company} - ${job.role} → ${match.status}`);
          }
        }
      } catch (parseError) {
        console.error("Failed to parse Python script output:", parseError);
      }
    });
  } catch (error) {
    console.error("Job fetching failed:", error);
  }
};


router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", async (err, user, info) => {
    if (err || !user) {
      return res.redirect("http://localhost:3000/auth");
    }

    req.logIn(user, async (err) => {
      if (err) {
        return res.redirect("http://localhost:3000/auth");
      }
  
      try {
        // 🔍 Fetch `enable` from database
        const result = await pool.query(
          "SELECT enable FROM users WHERE id = $1",
          [user.id]
        );
        
        const enable = result.rows[0]?.enable != null ? result.rows[0].enable : true;

        // ✅ Conditionally fetch jobs
        if (enable) {
         fetchAndUpdateJobs(user.id);
          console.log("Jobs fetched because enable is true");
        } else {
          console.log("Enable is false. Skipping job fetch.");
        }

        return res.redirect("http://localhost:3000/home");
      } catch (error) {
        console.error("Error during post-login processing:", error);
        return res.redirect("http://localhost:3000/home");
      }
    });
  })(req, res, next);
});

module.exports = router;