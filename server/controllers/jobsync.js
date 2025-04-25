const axios = require("axios");
const pool = require("../db");
require("dotenv").config();

// -------------------- API Constants --------------------
{/*
const ADZUNA_API_URL = process.env.ADZUNA_API_URL;
const APP_ID = process.env.APP_ID;
const APP_KEY = process.env.APP_KEY;
const MAX_ADZUNA_PAGES = process.env.MAX_ADZUNA_PAGES;

const FINDWORK_API_KEY =process.env.FINDWORK_API_KEY;
const FINDWORK_API_URL = process.env.FINDWORK_API_URL;

const REMOTIVE_API = process.env.REMOTIVE_API;
const LINKEDIN_API_URL = process.env.LINKEDIN_API_URL;
const LINKEDIN_API_KEY = process.env.LINKEDIN_API_KEY;
const LINKEDIN_API_HOST = process.env.LINKEDIN_API_HOST;*/}

const ADZUNA_API_URL = "https://api.adzuna.com/v1/api/jobs/in/search/";
const APP_ID = "e95bf1ee";
const APP_KEY = "a894aea452bf9d26f170b92d2551aa39";
const MAX_ADZUNA_PAGES = 2;

const FINDWORK_API_KEY = "60b3c490da0aa65c628298060c00d298790eec86";
const FINDWORK_API_URL = "https://findwork.dev/api/jobs/";

const REMOTIVE_API = "https://remotive.com/api/remote-jobs";
const LINKEDIN_API_URL = "https://linkedin-job-search-api.p.rapidapi.com/active-jb-24h";
const LINKEDIN_API_KEY = "5d462c0dcfmshd29f8b8e1ea6ff5p1264aajsn434f794b0b31";
const LINKEDIN_API_HOST = "linkedin-job-search-api.p.rapidapi.com";



function normalizeText(text) {
  return text.trim().toLowerCase();
}

// -------------------- Helper Function --------------------
// Limit location to a max of 3 places and add ellipsis if more than 3
function limitLocations(location, maxLocations = 3) {
  if (location) {
    const locationsArray = location.split(',').map(loc => loc.trim());
    if (locationsArray.length > maxLocations) {
      return locationsArray.slice(0, maxLocations).join(", ") + "...";
    }
    return locationsArray.join(", ");
  }
  return "";
}

// -------------------- Adzuna --------------------
async function fetchAdzunaJobs(searchTerm = '') {
  const jobs = [];

  for (let page = 1; page <= MAX_ADZUNA_PAGES; page++) {
    try {
      const res = await axios.get(`${ADZUNA_API_URL}${page}`, {
        params: {
          app_id: APP_ID,
          app_key: APP_KEY,
          results_per_page: 50,
          what: searchTerm,
        },
      });

      res.data.results.forEach(job => {
        if (job.location?.display_name && job.location.display_name.trim() !== "") { // Check if location exists
          const truncatedLocation = limitLocations(job.location.display_name);
          jobs.push({
            title: job.title,
            company: job.company.display_name,
            location: truncatedLocation,
            salary: job.salary_min && job.salary_max ? `£${job.salary_min} - £${job.salary_max}` : "Not specified",
            description: job.description,
            url: job.redirect_url,
            label: job.category?.label || " ",
            tag: job.contract_type || " ",
            skills:job.keywords??[]
          });
        }
      });
    } catch (err) {
      console.error(`Adzuna error (page ${page}):`, err.message);
      break;
    }
  }

  console.log(`Adzuna: ${jobs.length}`);
  return jobs;
}

// -------------------- Findwork --------------------
async function fetchFindworkJobs() {
  const jobs = [];
  let nextUrl = FINDWORK_API_URL;

  try {
    while (nextUrl) {
      const response = await axios.get(nextUrl, {
        headers: { Authorization: `Token ${FINDWORK_API_KEY}` },
      });

      const results = response.data.results;
      results.forEach((job) => {
        if (job.location && job.location.trim() !== "") { // Check if location exists
          const truncatedLocation = limitLocations(job.location);
          jobs.push({
            title: job.role,
            company: job.company_name,
            location: truncatedLocation,
            salary: "Not specified",
            description: job.text || job.description || "",
            url: job.url || "Not available",
            label: job.role|| "",
            tag: job.remote === true ? "remote" : "",
            skills:job.keywords??[]
          });
        }
      });

      nextUrl = response.data.next;
    }

    console.log(`✅ Findwork: ${jobs.length}`);
  } catch (error) {
    console.error("Findwork error:", error.response?.status, error.response?.data || error.message);
  }

  return jobs;
}

// -------------------- Remotive --------------------
async function fetchRemotiveJobs() {
  const jobs = [];

  try {
    const res = await axios.get(REMOTIVE_API);
    const indiaJobs = res.data.jobs.filter(job =>
      job.candidate_required_location.toLowerCase().includes("india")
    );

    indiaJobs.forEach(job => {
      if (job.candidate_required_location && job.candidate_required_location.trim() !== "") { // Check if location exists
        const truncatedLocation = limitLocations(job.candidate_required_location);
        jobs.push({
          title: job.title,
          company: job.company_name,
          location: truncatedLocation,
          salary: "Not specified",
          description: job.description || "",
          url: job.url,
          label: job.job_type || " ",
          tag: job.category || " ",
          skills:job.keywords??[]
        });
      }
    });

    console.log(`Remotive: ${jobs.length}`);
  } catch (err) {
    console.error("Remotive error:", err.message);
  }

  return jobs;
}


//------------------------ linkedin --------------------

async function fetchLinkedInJobs(searchTerm = "engineer", location = "India") {
  const jobs = [];

  const options = {
    method: 'GET',
    url: LINKEDIN_API_URL,
    params: {
      limit: '30',
      offset: '0',
      title_filter: searchTerm,
      location_filter: `"${location}"`
    },
    headers: {
      'x-rapidapi-key': LINKEDIN_API_KEY,
      'x-rapidapi-host': LINKEDIN_API_HOST
    }
  };

  try { const response = await axios.request(options);
    console.log("LinkedIn response received");

    if (response.data?.message?.includes("disabled for your subscription")) {
      console.warn("⚠️ LinkedIn API: Endpoint disabled for your plan.");
      return jobs;
    }

    const results = response.data || [];
    results.forEach(job => {
      const derivedLocations = job.locations_derived?.join(", ") || "";
      const truncatedLocation = limitLocations(derivedLocations);

      jobs.push({
        title: job.title,
        company: job.organization,
        location: truncatedLocation,
        salary: job.salary_raw || "Not specified",
        description: job.linkedin_org_description || "",
        url: job.url || "Not available",
        tag: job.employment_type?.join(", ") || " ",
       label: job.linkedin_org_industry || " ",
        skills: job.linkedin_org_specialties || []
      });
    });

    console.log(`LinkedIn: ${jobs.length}`);
  } catch (error) {
    console.error("LinkedIn error:", error.response?.status, error.response?.data || error.message);
  }

  return jobs;
}

// -------------------- Sync All --------------------
async function syncJobs() {
    const linkedinJobs = await fetchLinkedInJobs(); 
    const adzunaJobs = await fetchAdzunaJobs();
    const findworkJobs = await fetchFindworkJobs();
    const remotiveJobs = await fetchRemotiveJobs();
    
    const allJobs = [...linkedinJobs,...adzunaJobs, ...findworkJobs, ...remotiveJobs];
  console.log(`\n Total jobs fetched from all sources: ${allJobs.length}\n`);

  const apiKeys = new Set(
    allJobs.map(job => normalizeText(`${job.title}::${job.company}`))
  );

  const { rows: existingJobs } = await pool.query("SELECT id, title, company FROM jobs");
  const existingKeys = new Set(
    existingJobs.map(job => normalizeText(`${job.title}::${job.company}`))
  );

  const expiredJobs = existingJobs.filter(
    job => !apiKeys.has(normalizeText(`${job.title}::${job.company}`))
  );

  const expiredIds = expiredJobs.map(job => job.id);

  if (expiredIds.length) {
    console.log(`🗑️ Deleting ${expiredIds.length} expired jobs:`);
    expiredJobs.forEach(job => console.log(`- ${job.title} at ${job.company}`));
    await pool.query("DELETE FROM jobs WHERE id = ANY($1)", [expiredIds]);
  } else {
    console.log("✅ No expired jobs to delete");
  }

  let insertedCount = 0;
  for (const job of allJobs) {
    const key = normalizeText(`${job.title}::${job.company}`);
    if (!existingKeys.has(key)) {
      try {
        await pool.query(
          `INSERT INTO jobs (title, company, location, salary, description, url, label, tag, skills)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [job.title, job.company, job.location, job.salary, job.description, job.url, job.label, job.tag, job.skills]
        );
        insertedCount++;
      } catch (err) {
        console.error(`Failed to insert job (${job.title}):`, err.message);
      }
    }
  }

  console.log(`✅ Inserted ${insertedCount} new jobs`);
}

module.exports = syncJobs;