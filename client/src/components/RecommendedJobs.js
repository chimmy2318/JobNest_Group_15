import React, { useEffect, useState,useCallback  } from 'react';
import {MapPin, Bookmark} from "lucide-react";
import axios from 'axios';
import { useNavigate} from 'react-router-dom';
import { BsBookmarkFill } from 'react-icons/bs';
const RecommendedJobs = ({searchTerms, locationFilters, companyFilters }) => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
     const [savedJobs, setSavedJobs] = useState([]);

   
  const fetchSavedJobs = async () => {
    try {
      const response = await axios.get("http://localhost:6005/api/jobss/saved", {
        withCredentials: true,
      });
      setSavedJobs(response.data);
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
    }
  };
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
    const fetchRecommendedJobs = useCallback(async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:6005/api/job/recommended', {
          withCredentials: true,
          params: {
            search: searchTerms,
            location: locationFilters,
            company: companyFilters,
          },
        });
        setJobs(response.data);
      } catch (error) {
        console.error('Failed to load recommended jobs:', error);
      } finally {
        setLoading(false);
      }
    }, [searchTerms, locationFilters, companyFilters]);
    useEffect(() => {
     { const getUser = async () => {
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
  
     
     getUser();}
      fetchSavedJobs();
    }, [navigate]);
  
    useEffect(() => {
      fetchRecommendedJobs();
    }, [fetchRecommendedJobs]);
 
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

    const handleClick = (desc) => {
      if (typeof desc !== 'string') return; // guard clause
      navigate('/res', { state: { jobDescript: desc } });
    };
    
    
    const handleNoClick = () => {
      // When user clicks "No", just close the popup and go back to original form
      setShowPopup(false);
      setSelectedJob(null); // Clear selected job
    };
    const handleSubmit = async(e) => {
      e.preventDefault();
      if (!company || !role) {
        alert("Both Company and Role are mandatory fields!"); // Display an error message
        return; // Prevent form submission
      }
      if (company && role) {
        try {
          const newJob = {
            company:company,
            role:role,
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
      const isJobSaved = (jobId) => {
        return savedJobs.some((job) => job.id === jobId);
      };    
  if (loading) return <p>Loading recommended jobs...</p>;

  return (
    <div>
       
      <h2 className="page-title">Recommended for You</h2>
      {jobs.length === 0 ? (
        <p>No jobs matched your skills. Try adding more skills to your profile.</p>
      ) : (
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
                <h3 className="job-title">{job.title}</h3>
                <p className="location"><MapPin size={12} /> {job.location}</p>
                <p className="job-description">
                  {/*job.description
                    ? job.description.slice(0, 120) + "..."
                    : "No description available."*/}
                     <div className="job-tags">
                    <span className="tag">{job.label}</span>
                    {/*<span className="tag">{job.categoryTag}</span>*/}
                  </div>
                </p></div>
                <div className="job-buttons">
                <a href={job.url}
                   target="_blank"
                   onClick={(e) => handleApplyClick(e, job)} // Pass the job as an argument
                   rel="noopener noreferrer"
                   className="apply-button"> Apply
                </a>
                <button 
  className="apply-button" 
  onClick={() => handleClick(job.description || "No description available")}>
  ResOpt
</button>

                </div>
              </div>
            ))}
          </div>
      )}
   
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
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
              <input
                type="text"
                placeholder="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
      </div>
  );
};

export default RecommendedJobs;