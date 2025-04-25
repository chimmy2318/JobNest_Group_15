// routes/resumeRoutes.js
const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const axios = require('axios');
const { callGroqAI, callGroqATS } = require('../controllers/rescontroller');

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

// POST endpoint to handle resume upload and optimization
router.post('/aa', upload.single('resume'), async (req, res) => {
  const jobDesc = req.body.jobDescription;

  if (!req.file) {
    return res.status(400).json({ error: 'No resume uploaded.' });
  }

  try {
    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfText = await pdfParse(dataBuffer);
    const resumeText = pdfText.text;

    // Call Groq AI for resume optimization
    const aiTips = await callGroqAI(resumeText, jobDesc);
    // Call Groq ATS for ATS scoring
    const atsScore = await callGroqATS(resumeText, jobDesc);
    fs.unlinkSync(req.file.path); // Delete the uploaded file
    res.json({
      tips: aiTips,
      ats: atsScore,
      message: 'Optimization complete!',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process resume.' });
  }
});

module.exports = router;