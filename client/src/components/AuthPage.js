import React, { useState } from 'react';
import '../styles/Page.css'; // Make sure the path is correct based on your structureclient/src/Components/Page.css
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock, Eye, EyeOff,Info } from "lucide-react";

const AuthPage = () => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
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
  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;


    try {
      const res = await fetch('http://localhost:6005/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      const data = await res.json();
    console.log('Login response:', data);
      if (res.ok) {
        const enable = await fetchEnableStatus();
        if (enable) {
          await fetchJobss();
        }
        navigate('/home'); // redirect on success
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Signup handler
  const handleSignup = async (e) => {
    e.preventDefault();
    const username = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
  
    try {
      const res = await fetch('http://localhost:6005/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
        credentials: 'include',
      });
  
      const data = await res.json();
  
      console.log('res.ok:', res.ok);
      console.log('status:', res.status);
      console.log('response body:', data);
      console.log("Sending signup data:", { username, email, password });
      if (res.ok) {
        const enable = await fetchEnableStatus();
        if (enable) {
          await fetchJobss();
        }
        navigate('/home');
      } else {
        alert(data.error || 'Signup failed');
      }
  
    } catch (err) {
      console.error('Signup error:', err);
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="authy">
    <div className={`container ${isSignUpMode ? 'sign-up-mode' : ''}`}>
      <div className="forms-container">
        <div className="signin-signup">
          {/* Login Form */}
          <form onSubmit={handleLogin} className="sign-in-form">
            <h2 className="title">Welcome Back</h2>
            <p className="subtitle">Sign in to continue your journey</p>
           {/* <div className="input-field">
            <Mail className="field-icon" />
              <input type="email" placeholder="Email" required />
            </div>

            <div className="input-field">
              <Lock className="field-icon" />
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                placeholder="Password" 
                required 
              />
              <button 
                type="button" 
                className="toggle-password" 
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <input type="submit" value="Login" className="btn solid" />
            <div className="social-divider">
              <span>or continue with</span>
            </div>*/}
 <div className='email-notice'>
              <Info size={20} className="icon" />
            <span>The email parsing feature is enabled by default. You can disable it anytime from your profile settings. </span>
            </div>
         
            <div className="google-container">
            <a href="http://localhost:6005/api/auth/google" className="google-login-btn">
                Sign in with Google
            </a>
            </div>
          </form>

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="sign-up-form">
            <h2 className="title">Create Account</h2>
            <p className="subtitle">Join our community today</p>
         {/*   <div className="input-field">
            <User className="field-icon" />
              <input type="text" placeholder="Username" required />
            </div>
            <div className="input-field">
            <Mail className="field-icon" />
              <input type="email" placeholder="Email" required />
            </div>

            <div className="input-field">
              <Lock className="field-icon" />
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                placeholder="Password" 
                required 
              />
              <button 
                type="button" 
                className="toggle-password" 
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
               <input type="submit" value="Sign up" className="btn solid" />*/}
            <div className='email-notice'>
              <Info size={20} className="icon" />
            <span>The email parsing feature is enabled by default. You can disable it anytime from your profile settings. </span>
            </div>
         
            <div className="google-container">
            <a href="http://localhost:6005/api/auth/google" className="google-login-btn">
                Sign in with Google
            </a>
            </div>
          </form>
        </div>
      </div>

      {/* Animated panels */}
      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>New here?</h3>
            <p>Sign up and discover new opportunities!</p>
            <button className="btn transparent" onClick={() => setIsSignUpMode(true)}>
              Sign up
            </button>
          </div>
          <img src="/log.svg" className="image" alt="login" />
        </div>

        <div className="panel right-panel">
          <div className="content">
            <h3>One of us?</h3>
            <p>Login to continue your journey!</p>
            <button className="btn transparent" onClick={() => setIsSignUpMode(false)}>
              Sign in
            </button>
          </div>
          <img src="/register.svg" className="image" alt="signup" />
        </div>
      </div>
    </div></div>
  );
};

export default AuthPage;



