const pool = require("../db");


const fetchJobsFromDB = async (searchQuery = "", location = "", company = "") => {
  try {
    let query = "SELECT * FROM jobs WHERE true"; // Start with a base condition
    let params = [];
    let counter = 1; // For parameter placeholders

    // Apply search term filter if provided
    if (searchQuery) {
      query += ` AND title ILIKE $${counter} `;
      params.push(`%${searchQuery}%`);
      counter++;
    }

    // Apply location filter if provided
    if (location) {
      query += ` AND location ILIKE $${counter}`;
      params.push(`%${location}%`);
      counter++;
    }

    // Apply company filter if provided
    if (company) {
      query += ` AND company ILIKE $${counter}`;
      params.push(`%${company}%`);
      counter++;
    }

    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.error("Error fetching jobs from database:", error);
    return [];
  }
};


const getRecommendedJobs = async (req, res) => {
  try {
    const userId = req.user.id;
    //const userId=1;
    console.log("User ID:", userId); 

    const userResult = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      console.log("User not found in DB");
      return res.status(404).json({ error: "User not found" });
    }

    const skillsString = userResult.rows[0].skills || "";
    const userSkills = skillsString.split(",").map(skill => skill.trim().toLowerCase());

    const { search = "", location = "", company = "" } = req.query;

    console.log("User Skills:", userSkills); 

    const jobsResult = await pool.query("SELECT * FROM jobs");

    const skillMatchedJobs = jobsResult.rows.filter(job => {
      const jobSkills = (job.skills || "")
  .replace(/[{}]/g, "") // Remove curly braces
  .split(",")
  .map(skill =>
    skill.replace(/^"|"$/g, "").trim().toLowerCase()
  );

  // Check if any of the user's skills match any job's skills
     return userSkills.some(skill => jobSkills.includes(skill));
    });
    const searchTerm = search.trim().toLowerCase();
const locationTerm = location.trim().toLowerCase();
const companyTerm = company.trim().toLowerCase();

const filteredJobs = skillMatchedJobs.filter(job => {
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

    console.log("Final Filtered Job Count:", filteredJobs.length);

    res.json(filteredJobs);
  } catch (err) {
    console.error("Error in getRecommendedJobs:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = { fetchJobsFromDB,getRecommendedJobs};