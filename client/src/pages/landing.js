import React from "react";
import "../styles/HomePage.css";
import { useNavigate } from 'react-router-dom';
import HowItWorks from "../components/how-it-works";
import FAQ from "../components/faq";
import AboutUs from "../components/AboutUs";
import Footer from "../components/Footer";
import FeaturesSection from "../components/features";
import heroimg from '../Images/hero.png';
import logo from '../Images/logo-cropped-1.png'; 
const LandPage = () => {
   const navigate = useNavigate();
  
    

  return (
    <div >




 <div className='navy'>
    <nav className="navbar">
    <div className="logo">
  <img src={logo} alt="JobNest Logo" className="logo-image" />
  <span className="logo-text">JobNest</span>
</div>

      <div className="nav-links">
        <a href="#homes" className="nav-item">Home</a>
        <a href="#features" className="nav-item">Features</a>
        <a href="#howitworks" className="nav-item">How It Works</a>
        <a href="#faqs" className="nav-item">FAQs</a>
       
        <a href="#aboutus" className="nav-item">About Us</a>
       {/* <a href="#footer" className="nav-item">Contact</a>*/}
      </div>


      <div className="nav-buttons">
    
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
             {/*    <button
        className="btn btn-outline"
        onClick={() => navigate("/profile")}
      >
        Profile
      </button>*/}
        <button
              className="btn btn-outline"
              onClick={() => navigate('/auth')}
            >
              Login / Register
            </button>
          </div>
        
        {/*}  <div className="user-profile">
            <button
              className="btn btn-outline"
              onClick={logout}
            >
              Logout
            </button>*/}
          { /* <div className="avatar">{user.username[0].toUpperCase()}</div>*/}
          </div>
          </nav>
   
  









      <div className="background"></div>

      <main className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
          
          Track, Apply, Succeed — <span>All in One Place</span><br />

          </h1>
          <p className="hero-subhead">
          Losing track of where you applied?
          </p>
          <p className="hero-subtitle">
          Manage your job applications in one place, get AI-powered resume help, 
          and never miss a deadline again.
          </p>
          <button className="cta-button" onClick={() => navigate('/auth')}>Get Started</button>
        </div>

        <div className="hero-image">
        <img src={heroimg} alt="hero-img" />
        </div>
      </main>

     <FeaturesSection/>




      < HowItWorks/>
          <FAQ/>
          <AboutUs/>






     <Footer /></div>   </div>
  );
};

export default LandPage;