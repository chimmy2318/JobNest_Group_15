import React, { useEffect } from "react";
import "../styles/HomePage.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import HowItWorks from "../components/how-it-works";
import FAQ from "../components/faq";
import AboutUs from "../components/AboutUs";
import Footer from "../components/Footer";

import heroimg from '../Images/hero.png';
import myImage from '../Images/dashed-circle-design.png';
import myImage2 from '../Images/blur.png';
import myImage3 from '../Images/circle_594846.png';
import myImage4 from '../Images/eclipse_17045328.png';
import Resume from '../Images/applicant (1).png';
import Recommendation from '../Images/job-description (1).png';
import Saved from '../Images/save.png';
import Search from '../Images/job-description.png';
import Email from '../Images/email-track.png';


const HomePage = () => {
   const navigate = useNavigate();
  
const fetchEnableStatus = async () => {
  try {
    const res = await axios.get("http://localhost:6005/api/profile/enable", {
      withCredentials: true,
    });
    const enable = res.data.enable;
    console.log("Enable status:", enable);
    return enable; // You can return it to set in state or context
  } catch (err) {
    console.error("Failed to fetch enable:", err);
    return null; // Optional fallback
  }
};
   const fetchJobss = async () => {
    try {
      await axios.get('http://localhost:6005/api/track/gets',{withCredentials: true},
       {params: {
          sortBy: 'dateModified',
          order: 'DESC'}
        });
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    }
  };
    useEffect(() => {
      const getUser = async () => {
        try {
          const response = await axios.get("http://localhost:6005/api/auth/login/sucess", {
            withCredentials: true
          });
          const enable = await fetchEnableStatus();
        if (enable) {
          await fetchJobss();
        }
       
          console.log("response", response);
          // optionally set user state here if you want to display username, etc.
        } catch (error) {
          console.log(error)
          navigate("*"); // redirect to error or login page
        }
      };
     
      getUser();
    }, [navigate]);
  
  
    

  return (
    <div className="navy">

      <Navbar/>
      <div className="background"></div>

      <main className="hero" id="homes">
        <div className="hero-content">
          <h1 className="hero-title">
          
          Apply, Track, Succeed — <span>All in One Place</span><br />

          </h1>
          <p className="hero-subhead">
          Losing track of your applications?
          </p>
          <p className="hero-subtitle">
          Manage your job applications in one place, get AI-powered resume help, 
          and never lose track of your applications again.
          </p>
          <button className="cta-button" onClick={() => window.location.hash = '#features'}>Get Started</button>

        </div>

        <div className="hero-image">
        <img src={heroimg} alt="hero-img" />
        </div>
      </main>

      <div className="feature-background" id="features">
        <div className="feature-container">
          <h2 className="feature-title">Our  Features</h2>

          <img src={myImage} alt="Decorative" className="feature-image" />
          <img src={myImage2} alt="Blur icon decorative background" className="feature-image2 top-right" />
          <img src={myImage2} alt="Blur icon decorative background" className="feature-image2 bottom-left" />
          <img src={myImage3} alt="blue circle decorative background" className="feature-image3 top-right" />
          <img src={myImage3} alt="blue circle decorative background" className="feature-image3 bottom-left" />
          <img src={myImage4} alt="sky circle decorative background" className="feature-image4 top-right" />
          <img src={myImage4} alt="sky circle decorative background" className="feature-image4 bottom-left" />

          <div class="card-container">

          <div class="row row-1">
          <div class="card">
            <div class="bg"></div>
            <h3 className="gradient-text">Job Browse</h3>
            <p class="card-description">
              Explore and revisit the jobs you’ve saved for later.
            </p>
            <img src={Search} alt="search" className="card-icon" />
            <div class="cookieCard"></div>
            <div class="blob"></div>
            <button className="acceptButton" onClick={() => navigate('/jobs')}>Explore</button>
          </div>
          <div class="card">
            <div class="bg"></div>
            <div class="blob"></div>
            <h3 className="gradient-text">Recommendations</h3>
            <p class="card-description">
            Suggests relevant jobs based on preferences and skills.
            </p>
            <img src={Recommendation} alt="recommendation" className="card-icon" />
            <div class="cookieCard"></div>
            <button class="acceptButton"onClick={() => navigate('/jobs/recommended')}>Explore</button>
          </div>
          <div class="card">
            <div class="bg"></div>
            <div class="blob"></div>
            <h3 className="gradient-text">Resume Enhancement</h3>
            <p class="card-description">
            Intelligent resume optimization using AI.
            </p>
            <img src={Resume} alt="resume" className="card-icon" />
            <div class="cookieCard"></div>
            <button class="acceptButton"onClick={() => navigate('/res')}>Explore</button>
          </div>
          </div>


          <div class="row row-2">
          <div class="card">
            <div class="bg"></div>
            <div class="blob"></div>
            <h3 className="gradient-text">Application Tracking</h3>
            <p class="card-description">
            Automated tracking of job applications.
            </p>
            <img src={Email} alt="email" className="card-icon" />
            <div class="cookieCard"></div>
            <button class="acceptButton"onClick={() => navigate('/track')}>Explore</button>
          </div>
          <div class="card">
            <div class="bg"></div>
            <div class="blob"></div>
            <h3 className="gradient-text">Saved Jobs</h3>
            <p class="card-description">
              Explore and revisit the jobs you’ve saved for later.
            </p>
            <img src={Saved} alt="saved" className="card-icon" />
            <div class="cookieCard"></div>
            <button class="acceptButton"onClick={() => navigate('/jobs/saved')}>Explore</button>
          </div>
          </div>
        </div>
      </div>
      

      </div>


      < HowItWorks/>

      <FAQ/>
      <AboutUs/>










     <Footer /></div>
  );
};

export default HomePage;