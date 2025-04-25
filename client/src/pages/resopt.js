import React, { useState ,useEffect }  from 'react';

import { useNavigate } from "react-router-dom";
import axios from 'axios';
import '../styles/resopt.css';
import {Upload }from 'lucide-react';
import { marked } from 'marked';
import Navbar from "../components/Navbar";
import 'font-awesome/css/font-awesome.min.css';
import { useLocation } from 'react-router-dom';
import ress from "./WhatsApp_Image_2025-04-20_at_18.09.41-removebg-preview.png"
function Resumeopt() {
  const navigate = useNavigate();
  const location = useLocation();
 
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState(location.state?.jobDescript || '');
  const [activeTab, setActiveTab] = useState("tips");

  const [result, setResult] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length && files[0].type === 'application/pdf') {
      setResumeFile(files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile || !jobDescription) return;

    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('jobDescription', jobDescription);

    try {
      const res = await axios.post('http://localhost:6005/api/optimize/aa', formData);
      setResult(res.data);
    } catch (error) {
      console.error(error);
    }
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
  }, [navigate]);

 

  return (
    <div>
    <Navbar/>
    <div className="resume-opt">
      <div className="app-container">
        <div className="card">
        <div className="cardi">
        <img src={ress} width="90%" />  
  <h1 >Resume Optimization</h1>
  <p>
    Upload your resume and the job description, and let our AI create a perfectly tailored resume that maximizes your chances of getting noticed.
  </p>

</div>

          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label className='hi'><Upload size ={24}/> Upload Resume (PDF)</label>
              <div 
                className={`upload-area ${isDragging ? 'dragging' : ''}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {resumeFile ? (
                  <div className="file-selected">
                    <i className="fa fa-file-pdf-o"></i>
                    <p>{resumeFile.name}</p>
                  </div>
                ) : (
                  <>
                    <div className="upload-icon">
                      <i className="fa fa-cloud-upload"></i>
                    </div>
                    <p className="upload-text">Drag & Drop your resume here</p>
                    <p className="upload-or">OR</p>
                    <label htmlFor="file-upload" className="browse-btn">
                      Browse Files
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                  </>
                )}
              </div>
              <p className="format-info">Accepted format: PDF</p>
            </div>

            <div className="form-group">
              <label className='hi'>Job Description</label>
              <textarea
                rows="6"
                placeholder="Paste job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            <button type="submit" className="submit-btn">Optimize</button>
          </form>
        </div>

        {result && (
        
          <div className="result-section">
              <div className="tab-buttons">
          <button onClick={() => setActiveTab("tips")} className={activeTab === "tips" ? "active" : ""}>Tips</button>
          <button onClick={() => setActiveTab("ats")} className={activeTab === "ats" ? "active" : ""}>ATS Insights</button>
        </div>
        <div className="tab-content">

  {activeTab === "tips" && (
    <div className="tab-card fade">
      <h2>Improvement Tips</h2>
      <div dangerouslySetInnerHTML={{ __html: marked(String(result.tips)) }} />
    </div>
  )}

  {activeTab === "ats" && (
    <div className="tab-card fade">
      <h2>ATS Match Insights</h2>
      <div dangerouslySetInnerHTML={{ __html: marked(String(result.ats)) }} />
    </div>
  )}

</div>

       
          </div>
        )}
      </div>
    </div></div>
  );
}

export default Resumeopt;