

import React,{useState} from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
//import { useAuth } from '../Components/AuthContext';
//import { User } from 'lucide-react';
import logo from '../Images/logo-cropped-1.png'; // Adjust the path as necessary
import '../styles/LandingSection.css'; // Create this for navbar-specific styles

const Navbar = () => {
  const location=useLocation();
  //const { user, logout } = useAuth();
  const navigate = useNavigate();
 const handlenav=(sectionid)=>{
  if(location.pathname!=='/home'){
navigate('/home',{state:{scrollTo:sectionid}});
  }
  else{
    const element=document.getElementById(sectionid);
    if(element){
      element.scrollIntoView({behavior:'smooth'});
    }
  }
 };
 React.useEffect (() => {
  if (location.state?.scrollTo) {
  const element = document.getElementById(location.state.scrollTo);
  if (element) {
  setTimeout (() => {
  element.scrollIntoView({ behavior: 'smooth' });
  }, 100); // Small delay to ensure page is loaded
}}},[location.state]);
    /// Logout function
    const logout = () => {
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      window.open("http://localhost:6005/api/auth/logout", "_self"); // clears session on backend and redirects
    };
  return (
    <div className='navy'>
    <nav className="navbar">
      <div className="logo">
  <img src={logo} alt="JobNest Logo" className="logo-image" />
  <span className="logo-text">JobNest</span>
</div>

     <div className="nav-links">
      <button     className="nav-item"
      onClick={()=>handlenav('homes')}>
  Home
      </button>
      <button     className="nav-item"
      onClick={()=>handlenav('features')}>
  Features
      </button>
      <button     className="nav-item"
      onClick={()=>handlenav('howitworks')}>
  How It Works
      </button>
      <button     className="nav-item"
      onClick={()=>handlenav('faqs')}>
  FAQs
      </button>
      <button     className="nav-item"
      onClick={()=>handlenav('aboutus')}>
  About Us
      </button>
      
  {/*
        <a href="#homes" className="nav-item">Home</a>
        <a href="#features" className="nav-item">Features</a>
        <a href="#howitworks" className="nav-item">How It Works</a>
        <a href="#faqs" className="nav-item">FAQs</a>
       
        <a href="#aboutus" className="nav-item">About Us</a>
      <a href="#footer" className="nav-item">Contact</a>*/}
      </div>
      <div className="nav-buttons">
    
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
             <button
        className="btn btn-outline"
        onClick={() => navigate("/profile")}
      >
        Profile
      </button>
           {/* <button
              className="btn btn-outline"
              onClick={() => navigate('/authpage')}
            >
              Login / Register
            </button>
            <User size={20} />*/}
          </div>
        
          <div className="user-profile">
            <button
              className="btn btn-outline"
              onClick={logout}
            >
              Logout
            </button>
          { /* <div className="avatar">{user.username[0].toUpperCase()}</div>*/}
          </div>
        
      </div>
    </nav></div>
  );
};

export default Navbar;