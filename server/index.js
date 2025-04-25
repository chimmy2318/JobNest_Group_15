const express = require("express");
const cors = require("cors");
require("dotenv").config();


const { fetchAndStoreJobs } = require("./controllers/jobsController");
const { fetchJobsFromDB } = require("./controllers/jobsController"); // Import new function
const { createJobsTable } = require("./models/jobsModel");
const jobRoutes = require('./routes/jobsRoutes');
const savedJobsRoute = require("./routes/savedJobsRoute");
const profileRoutes = require('./routes/profileRoutes');
const resumeRoutes = require('./routes/resumeroutes');


const session = require("express-session");
const passport = require("passport");
require("./middleware/passport");
const authRoutes = require("./routes/authRoutes");
const trackRoutes = require('./routes/trackRoutes');

const app = express();
const PORT = process.env.PORT;

app.use(cors({
  origin: "http://localhost:3000", // Don't use '*'
  credentials: true                // Allow cookies & sessions
}));
app.use(express.json());



app.use(session({
  secret: process.env.SESSION_SECRET ,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 24 * 60 * 60 * 1000

  }
}));

app.use(passport.initialize());
app.use(passport.session());


// Initialize database table
createJobsTable();


app.get("/api/jobs", async (req, res) => {
  const { search, location, company } = req.query;
 
  try {
    const jobs = await fetchJobsFromDB(search, location, company);
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});


// Route to manually trigger job fetch and store
app.get("/api/store-jobs", async (req, res) => {
  try {
    const jobs = await fetchAndStoreJobs();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch and store jobs" });
  }
});

app.use('/api/job', jobRoutes);
app.use("/api/jobss", savedJobsRoute);
app.use('/api/track', trackRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/profile', profileRoutes);

app.use('/api/optimize', resumeRoutes);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});