import React from "react";
import "../styles/HomePage.css";
import { useNavigate } from 'react-router-dom';

import myImage from '../Images/dashed-circle-design.png';
import myImage2 from '../Images/blur.png';
import myImage3 from '../Images/circle_594846.png';
import myImage4 from '../Images/eclipse_17045328.png';
import Resume from '../Images/applicant (1).png';
import Recommendation from '../Images/job-description (1).png';
import Saved from '../Images/save.png';
import Search from '../Images/job-description.png';
import Email from '../Images/email-track.png';

const FeaturesSection = () => {
    const navigate = useNavigate();
  
    return (
        <div className="feature-background" id="features">
        <div class="feature-container">
          <h2 class="feature-title">OUR  FEATURES</h2>

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
            <button className="acceptButton" onClick={() => navigate('/auth')}>Explore</button>
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
            <button class="acceptButton"onClick={() => navigate('/auth')}>Explore</button>
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
            <button class="acceptButton"onClick={() => navigate('/auth')}>Explore</button>
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
            <button class="acceptButton"onClick={() => navigate('/auth')}>Explore</button>
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
            <button class="acceptButton"onClick={() => navigate('/auth')}>Explore</button>
          </div>
          </div>
        </div>
      </div>
      

      </div>
       );
    };
    
    export default FeaturesSection;