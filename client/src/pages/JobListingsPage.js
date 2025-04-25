import React, { useState, useEffect, useCallback } from "react";
import {MapPin, Bookmark,Location,Company} from "lucide-react";
import axios from "axios";
import { BsBookmarkFill } from 'react-icons/bs';
import RecommendedJobs from "../components/RecommendedJobs"; // Ensure this component exists
import "../styles/JobListings.css";
import { useNavigate, useLocation } from 'react-router-dom';
import im from "../Images/sodi.jpeg"
import Navbar from "../components/Navbar";
const JobListingsPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); 

  const isSavedPage = location.pathname === "/jobs/saved";
  const isRecommendedPage = location.pathname === "/jobs/recommended";



  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  //const [showRecommended, setShowRecommended] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [companyy, setCompany] = useState("");
  const [rolee, setRole] = useState("");
  const [savedJobs, setSavedJobs] = useState([]);
 

//const [showSavedJobs, setShowSavedJobs] = useState(false);
const handleClick = (desc) => {
  // Pass the job description to another page using navigate
  navigate('/res', { state: { jobDescript: desc } });
};


  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:6005/api/jobs", {
        params: {
          search: searchTerm,
          location: locationFilter,
          company: companyFilter,
        },
        withCredentials: true,
      });
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, locationFilter, companyFilter]);


  const fetchSavedJobs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:6005/api/jobss/saved", {
        params: {
          search: searchTerm,
          location: locationFilter,
          company: companyFilter,
        },
        withCredentials: true,
      });
      setSavedJobs(response.data);
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
    }finally {
      setLoading(false);
    }
  }, [searchTerm, locationFilter, companyFilter]);

{/*
  const fetchSavedJobs = async () => {
    try {
      const response = await axios.get("http://localhost:6005/api/jobss/saved", {
        withCredentials: true,
      });
      setSavedJobs(response.data);
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
    }
  };*/}
  const handleSaveJob = async (jobId) => {
    try {
      await axios.post(
        "http://localhost:6005/api/jobss/save",
        { jobId },
        { withCredentials: true }
      );
      fetchSavedJobs(); // Refresh the saved jobs list
    } catch (error) {
      console.error("Error saving job:", error.response?.data || error.message);
    }
  };
 
  const handleUnsaveJob = async (jobId) => {
    try {
      await axios.delete(`http://localhost:6005/api/jobss/unsave/${jobId}`, 
        {withCredentials: true}
      );
      fetchSavedJobs(); // Refresh saved jobs list
    } catch (error) {
      console.error("Error unsaving job:", error);
    }
  };

  const isJobSaved = (jobId) => {
    return savedJobs.some((job) => job.id === jobId);
  };    
  

  const handleApplyClick = (event, job) => {
    event.preventDefault();
    setSelectedJob(job); // Store the selected job
    setShowPopup(true);   // Show the popup
    setTimeout(() => {
      window.open(job.url, '_blank');
    }, 800); // Wait 500ms before opening the link to allow the popup to show
  };
  const handleYesClick = () => {
    // When user clicks "Yes", show the form to input company and role
    setShowPopup(false); // Hide the popup
  };
  const handleNoClick = () => {
    // When user clicks "No", just close the popup and go back to original form
    setShowPopup(false);
    setSelectedJob(null); // Clear selected job
  };
  const handleSubmit = async(e) => {
    e.preventDefault();
  if (!companyy || !rolee) {
    alert("Both Company and Role are mandatory fields!"); // Display an error message
    return; // Prevent form submission
  }
  if (companyy && rolee) {
    try {
      const newJob = {
        company:companyy,
        role:rolee,
        status: 'applied',
      };
      const res = await axios.post('http://localhost:6005/api/track/create', {...newJob}, {
        withCredentials: true,
      });
      console.log('Auto-submitted:', res.data);
    } catch (error) {
      console.error('Auto-submit failed:', error);
    }
  }
  navigate("/track");
    setCompany(""); // Clear the form
    setRole(""); // Clear the form
    setSelectedJob(null); // Close the form and popup
  };
  
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get("http://localhost:6005/api/auth/login/sucess", {
          withCredentials: true
        });
      
    // console.log("response", response);
        // optionally set user state here if you want to display username, etc.
      } catch (error) {
        console.log(error)
        navigate("*"); // redirect to error or login page
      }
    };
    getUser();
    fetchSavedJobs();
  }, [navigate]);
  useEffect(() => {const getUser = async () => {
    try {
      const response = await axios.get("http://localhost:6005/api/auth/login/sucess", {
        withCredentials: true
      });
    
  // console.log("response", response);
      // optionally set user state here if you want to display username, etc.
    } catch (error) {
      console.log(error)
      navigate("*"); // redirect to error or login page
    }
  };
  getUser();
    fetchJobs();
  }, [fetchJobs,navigate]);
  useEffect(() => {
    const getUser = async () => {
      try {
        await axios.get("http://localhost:6005/api/auth/login/sucess", {
          withCredentials: true,
        });
      } catch (error) {
        console.log(error);
        navigate("*");
      }
    };
  
    getUser();
  
    if (isSavedPage) {
      fetchSavedJobs(); // <-- will re-run when filters change
    }
  }, [isSavedPage, searchTerm, locationFilter, companyFilter, navigate]);
  return (
    <div>
       <Navbar/>
    <div className="job-listings-wrapper">
      {/* Sidebar */}
  
      <div className="filter-sidebar">
      <img src={im} style={{ width: '250px', height: '250px', marginLeft: '-12px' }} />
        <h3> Filters</h3>
        <div className="filter-input">
        <label htmlFor="location">Location</label>
        <input
          type="text"
         placeholder=""
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        /></div>
         <div className="filter-input">
          <label htmlFor="Company">Company</label>
        <input
          type="text"
          placeholder=""
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
        /></div>
         <div className="filter-input">
          <label htmlFor="Role">Role</label>
         <input
            type="text"
            placeholder= ""
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          /></div>
          <br/>
        <hr /> <br/>

        <button
          className="saved-jobs-btn"
          onClick={() => navigate("/jobs/saved")}>Saved Jobs
        </button>
        <button
          className="recommended-jobs-btn"
          onClick={() =>navigate("/jobs/recommended")}> Recommended Jobs
      </button>

      </div>

      {/* Main Content */}
      <div className="job-listings-container">
       

      
        {/* Show Recommended */}
        {isRecommendedPage  ? (
         <RecommendedJobs
       
         searchTerms={searchTerm}
         locationFilters={locationFilter}
         companyFilters={companyFilter}
       />
        ) : 
        
        
        isSavedPage ? ( <div >
             
      <h2 className="page-title">Saved Jobs</h2>
          <div className="job-list">
            {savedJobs.length > 0 ? (
              savedJobs.map((job) => (
                <div key={job.id} className="job-card">
                   <div className="topp">
                  <div className="Card-top">
                    <h3 className="company">{job.company}</h3>
                    <button
                       className="unsave-button"
                       onClick={() => handleUnsaveJob(job.id)}> 
                       <BsBookmarkFill size={16}/>
                    </button>
                    </div>
                  <h2 className="job-title">{job.title.slice(0,55)}</h2>
                  <p className="location"> <MapPin size={12} /> {job.location}</p>
                  {/*<p className="job-description">
                    {job.description
                      ? job.description.slice(0, 120) + "..."
                      : "No description available."}
                  </p>*/}
                  <div className="job-tags">
                    <span className="tag">{job.label}</span>
                    {/*<span className="tag">{job.categoryTag}</span>*/}
                  </div></div>
                  <div className="job-buttons">
                    <a
                      href={job.url}
                      target="_blank"
                      onClick={(e) => handleApplyClick(e, job)}
                      rel="noopener noreferrer"
                      className="apply-button"
                    >
                      Apply
                    </a>
                    <button className="apply-button" onClick={() => handleClick(job.description)}>ResOpt</button>

                  </div>
                </div>
              ))
            ) : (
              <p>No saved jobs yet.</p>
            )}
          </div> </div>
        ):
        
        loading ? (
          <p className="loading-text">Loading jobs...</p>
        ) : (
          <div>             <h2 className="page-title"> Discover Your Next Job</h2>
          <div className="job-list">

            {jobs.map((job) => (
              <div key={job.id} className="job-card">
                <div className="topp">
                <div className="Card-top">
                 <h3 className="company">{job.company}</h3>
                 <button className={`save-button ${
                    isJobSaved(job.id) ? "saved" : "" }`}
                    onClick={() => handleSaveJob(job.id)}
                    disabled={isJobSaved(job.id)}
                    >
                    {isJobSaved(job.id) ? <BsBookmarkFill size={16}/> : <Bookmark size={18}/>}
                  </button>
                </div>
                <h2 className="job-title">{job.title.slice(0,56)}</h2>
                <p className="location"><MapPin size={12} /> {job.location}</p>
                {/*<p className="job-description">
                  {job.description
                    ? job.description.slice(0, 120) + "..."
                    : "No description available."}
                </p>*/}
                <div className="job-tags">
                    <span className="tag">{job.label}</span>
                    {/*<span className="tag">{job.categoryTag}</span>*/}
                  </div></div>
                <div className="job-buttons">
                 <a
                   href={job.url}
                   target="_blank"
                   onClick={(e) => handleApplyClick(e, job)} // Pass the job as an argument
                   rel="noopener noreferrer"
                   className="apply-button"
                   > Apply
                  </a>  
                  <button className="apply-button" onClick={() => handleClick(job.description)}>ResOpt</button>
         
                </div>
              </div>
            ))}
          </div>  </div>
        )}
      </div>
      
  {/* Popup Modal - Centralized */}
  {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Have you applied for this job?</h3>
            <div className="popup-buttons">
              <button onClick={handleYesClick}>Yes</button>
              <button onClick={handleNoClick}>No</button>
            </div>
          </div>
        </div>
      )}

      {/* Form for Role and Company (Appears after Yes) */}
      {selectedJob && !showPopup && (
        <div className="form-overlay">
          <div className="form-content">
            <h3>Provide your details for {selectedJob.title}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Company"
                value={companyy}
                onChange={(e) => setCompany(e.target.value)}
              />
              <input
                type="text"
                placeholder="Role"
                value={rolee}
                onChange={(e) => setRole(e.target.value)}
              />
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div> </div> 
  );
};

export default JobListingsPage;