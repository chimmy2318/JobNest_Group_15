import React from "react";
import "../styles/HowItWorks.css";
import create from "../Images/admin-panel_8644481.png";
import search from "../Images/mobile-search.png";
import res from "../Images/landing-page_8644484.png";
import apply from "../Images/goal_8644451.png";
import track from "../Images/secured-network_8644536.png";
import succeed from "../Images/communication_8644538.png";

export default function HowItWorks() {
  return (
    <div id="howitworks">
        <div className='hiw-divider'></div>

<div className="hiw-section">
  <h2 className="hiw-title">How It Works?</h2>
  <p className="hiw-subtitle">
    Beneath each of these categories, you can find its most popular
  </p>
  <div className="hiw-steps-row">
    {/* Step 1 */}

   

    <div className="hiw-step-1">
    <div class="overlay"></div>
    <div class="circle"></div>
      <img
        src={create}
        alt="Create Account"
        className="hiw-step-img"
      />
      <h3 className="hiw-step-title">Create Your Account</h3>
      <p className="hiw-step-desc">
      Sign up in just a few clicks to create your personalized job seeker profile and unlock access to thousands of opportunities.
      </p>
      <span className="hiw-step-number">01.</span>
    </div>


    {/* Step 2 */}
    <div className="hiw-step-2">
    <div class="overlay"></div>
    <div class="circle"></div>
      <img
        src={search}
        alt="Search Job"
        className="hiw-step-img"
      />
      <h3 className="hiw-step-title">Search Your job</h3>
      <p className="hiw-step-desc">
      Explore job listings tailored to your skills, preferences, and location. Use filters to find the perfect match for your career goals.
      </p>
      <span className="hiw-step-number">02.</span>
    </div>
    {/* Step 3 */}
    <div className="hiw-step-3">
    <div class="overlay"></div>
    <div class="circle"></div>
      <img
        src={res}
        alt="Apply Job"
        className="hiw-step-img"
      />
      <h3 className="hiw-step-title">Enhance your Resume</h3>
      <p className="hiw-step-desc">
      Build a strong resume with our tools or upload your own. Highlight your achievements to stand out to top employers.
      </p>
      <span className="hiw-step-number">03.</span>
    </div>
  </div>

  <div className="hiw-steps-row">
    {/* Step 6 */}
    <div className="hiw-step-1">
    <div class="overlay"></div>
    <div class="circle"></div>
      <img
        src={succeed}
        alt="succeed"
        className="hiw-step-img"
      />
      <h3 className="hiw-step-title">Get your Dream Job!</h3>
      <p className="hiw-step-desc">
      Connect with top companies, attend interviews, and land your ideal job. Your career journey starts here.
      </p>
      <span className="hiw-step-number">06.</span>
    </div>
    {/* Step 5 */}
    <div className="hiw-step-2">
    <div class="overlay"></div>
    <div class="circle"></div>
      <img
        src={track}
        alt="track"
        className="hiw-step-img"
      />
      <h3 className="hiw-step-title">Track your Application</h3>
      <p className="hiw-step-desc">
      Stay updated on every stage of your application. Receive notifications when employers view, shortlist, or respond.
      </p>
      <span className="hiw-step-number">05.</span>
    </div>
    {/* Step 4 */}
    <div className="hiw-step-3">
    <div class="overlay"></div>
    <div class="circle"></div>
      <img
        src={apply}
        alt="apply"
        className="hiw-step-img"
      />
      <h3 className="hiw-step-title">Apply For Job</h3>
      <p className="hiw-step-desc">
      Submit applications seamlessly with one click. Track your submissions and get real-time updates on your progress.
      </p>
      <span className="hiw-step-number">04.</span>
    </div>
    
  </div>
</div>
    </div>
    
  );
}



<div className="how-it-works">
        <div className='hiw-divider'></div>
        <div className="hiw-container">
          <h1 className="hiw-title">
            How It Works?
          </h1>
          <div class="bcard wallet">
          <div class="overlay"></div>
          <div class="circle">


          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="23 29 78 60" height="60px" width="78px">
          <defs />
          <g transform="translate(23.000000, 29.500000)" fillRule="evenodd" fill="none" strokeWidth="1" stroke="none" id="icon">
          </g>
          </svg>

          </div>
          
    </div>
            {/*<a href="#" className="browse-link">
              Browse All <ChevronRight size={16} />
            </a>

          <div className="jobs-grid">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>*/}

        </div>
      </div>