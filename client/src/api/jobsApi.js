// src/api/jobsApi.js

import axios from "axios"; // Import default Axios to make API requests

// Fetch jobs from the backend (either from the database or Adzuna)
export const fetchJobs = async (searchTerm = "") => {
  try {
    const response = await axios.get("/jobs", {
      params: { search: searchTerm },
    });
    return response.data; // Return the fetched data
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error; // Throw error to be handled by calling function
  }
};
/*
export const unsaveJob = async (userId, jobId) => {
  const response = await axios.delete('/jobss/unsave', {
    data: { userId, jobId },
  });
  return response.data;
};*/