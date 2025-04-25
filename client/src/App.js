import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";

import LandPage from "./pages/landing";
import JobListingsPage from "./pages/JobListingsPage";
import TrackPage from "./pages/trackPage"
import AuthPage from './components/AuthPage';
import Error from './components/Error';
import ProfilePage from "./components/profilePage";
import Resumeopt from "./pages/resopt"; 
import { Navigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import ProtectedRoute from './components/protectedroute';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await axios.get('http://localhost:6005/api/auth/login/sucess', {
        withCredentials: true,
      });
      const userData = res.data.user;
  
      // Update the user state
      setUser(userData);
  
      // Optionally store in localStorage (for persistence)
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');

    } catch (err) {
      console.log("error fetching user", err);
      // Clear localStorage and user if fetch fails (e.g., not logged in)
      localStorage.removeItem('user');
      localStorage.setItem('isAuthenticated', 'false');
      setUser(null);
    }
  };
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  
    fetchUser(); // Optional: to refresh session status from server
  }, []);
  return (
    <Router>
   
      <Routes>

        <Route path='/' element={<Navigate to="/land" />} />
        <Route path="/land" element={<LandPage />} />
        <Route path="/auth" element={<AuthPage />} />
        {/* <Route path='/dashboard' element={<Dashboard />} /> */}
        <Route path="/home" element={
            <HomePage />
        }  />
        <Route path="/profile" element={ <ProfilePage /> } />
        <Route path="/res" element={ <Resumeopt />} />
        <Route path="/jobs" element={ <JobListingsPage />} />
        <Route path="/jobs/saved" element={ <JobListingsPage />} />
<Route path="/jobs/recommended" element={ <JobListingsPage />} />
        <Route path="/track" element={ <TrackPage />} />
        <Route path='*' element={  <Error />} />
      
      </Routes>
  
   
  </Router>
  );
}


export default App;