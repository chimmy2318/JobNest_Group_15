const express = require('express');
const pool = require('../db'); 
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profileController');
const isAuthenticated = require('../middleware/isAuthenticated'); 
// GET user profile
router.get('/get',isAuthenticated, getProfile);

// POST or PUT to update profile
router.post('/update',isAuthenticated, updateProfile);

router.get('/enable', isAuthenticated, async (req, res) => {
    const userId = req.user?.id;
  
    try {
      const result = await pool.query(
        "SELECT enable FROM users WHERE id = $1",
        [userId]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json({ enable: result.rows[0].enable });
    } catch (error) {
      console.error("Error fetching enable:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
module.exports = router;