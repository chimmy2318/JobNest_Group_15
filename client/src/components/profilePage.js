import React, { useState, useEffect } from 'react';
import { PlusCircle, Pencil, Save, Trash } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/profilePage.css';
import Navbar from "../components/Navbar";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: '',
    skills: '',
    enable:'',
    education: []
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await fetch('http://localhost:6005/api/profile/get', {
        credentials: 'include'
      });
      const data = await res.json();
      const education = Array.isArray(data.education) && data.education.length
        ? data.education.map((edu, i) => ({ id: i + '-' + Date.now(), ...edu }))
        : [{ id: Date.now().toString(), major: '', university: '', graduationYear: '' }];

      setProfile({
        name: data.name || '',
        skills: data.skills || '',
        enable: data.enable === true || data.enable === 'true',
        education
      });
    } catch (err) {
      console.error('Error loading profile', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  const handleEducationChange = (id, e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [name]: value } : edu
      )
    }));
  };

  const addEducation = () => {
    setProfile(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: Date.now().toString(),
          major: '',
          university: '',
          graduationYear: ''
        }
      ]
    }));
  };

  const deleteEducation = (id) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const handleSave = async () => {
    await handleSubmit({ preventDefault: () => {} });
    toast.success("Your profile has been successfully updated.");
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedEducation = profile.education
      .filter(edu => edu.major || edu.university || edu.graduationYear)
      .map(({ id, ...rest }) => rest);

    try {
      await fetch('http://localhost:6005/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: profile.name,
          skills: profile.skills,
          enable:profile.enable,
          education: cleanedEducation
        })
      });
      await fetchProfile();
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to save profile', err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <Navbar/>
   
    <div className="profile-container">
      <div className="profile-page">
        <div className="profile-header">
          <h2>Profile</h2>
          <div>
          {!isEditing && (
      <button
        onClick={() => setIsEditing(true)}
        className="edit-save-btn"
      >
        <Pencil size={16} /> Edit
      </button>
    )}
          </div>
        </div>


        

        {isEditing ? (
          <form className="edit-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <label htmlFor="name">Name</label>
              <input
                name="name"
                id="name"
                value={profile.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="form-input"
              />
            </div>

            <div className="form-section">
              <label htmlFor="skills">Skills</label>
              <input
                name="skills"
                id="skills"
                value={profile.skills}
                onChange={handleChange}
                placeholder="Enter your skills (comma separated)"
                className="form-input"
              />
            </div>
            <div className="form-section">
            <label>
        Give permission to track applications from Emails :    <input type="checkbox" name="enable" checked={profile.enable} onChange={handleChange} />
      </label>
            </div>
            <div className="form-groups">
  <h4>Education</h4>
  {profile.education.map((edu) => (
    <div key={edu.id} className="education-item">
      <div className="form-section">
        <label htmlFor={`major-${edu.id}`}>Major</label>
        <input
          name="major"
          id={`major-${edu.id}`}
          value={edu.major}
          onChange={(e) => handleEducationChange(edu.id, e)}
          placeholder="Major"
          className="form-input"
        />
      </div>

      <div className="form-section">
        <label htmlFor={`university-${edu.id}`}>University</label>
        <input
          name="university"
          id={`university-${edu.id}`}
          value={edu.university}
          onChange={(e) => handleEducationChange(edu.id, e)}
          placeholder="University"
          className="form-input"
        />
      </div>

      <div className="form-section">
        <label htmlFor={`graduationYear-${edu.id}`}>Graduation Year</label>
        <input
          name="graduationYear"
          id={`graduationYear-${edu.id}`}
          value={edu.graduationYear}
          onChange={(e) => handleEducationChange(edu.id, e)}
          placeholder="Graduation Year"
          className="form-input"
        />
      </div>

      <button 
        type="button" 
        className="delete-btn" 
        onClick={() => deleteEducation(edu.id)}
        aria-label="Delete education"
      >
        <Trash size={18} />
      </button>
    </div>
  ))}
  
  
</div>
            

<div className="buttons-container" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
  <button 
    type="button" 
    className="add-education-btn" 
    onClick={addEducation}
    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
  >
    <PlusCircle size={16} />
    <span>Add Education</span>
  </button>

  <button type="submit" className="edit-save-btn">
  <Save size={18}/> Save
</button>
  </div>
          </form>
        ) : (
          <div className="profile-display">
            <div className="form-groups">
              <label>Full Name</label>
              <p>{profile.name}</p>
            </div>

            <div className="form-groups">
              <h4>Education</h4>
              {profile.education.map((edu, index) => (
                <div className="education-block" key={index}>
                  <div className="form-groups">
                    <label>Major</label>
                    <p>{edu.major}</p>
                  </div>
                  <div className="form-groups">
                    <label>University</label>
                    <p>{edu.university}</p>
                  </div>
                 <div className="form-groups">
                   <label>Graduation Year</label>
                   <p>{edu.graduationYear}</p>
                 </div>
             </div>
              ))}
          </div>

          <div className="form-groups">
           <label>Skills</label>
           <p>{profile.skills}</p>
          </div>
          <div className="form-groups">
          <label>
          Enable Status:
      </label> <p> {profile.enable ? "Enabled" : "Disabled"}</p></div>
       </div>

        )}
      </div>
    </div> </div>
  );
};

export default ProfilePage;







/*<form className="edit-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <label htmlFor="name">Name</label>
              <input
                name="name"
                id="name"
                value={profile.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="form-input"
              />
            </div>

            <div className="form-section">
              <label htmlFor="skills">Skills</label>
              <input
                name="skills"
                id="skills"
                value={profile.skills}
                onChange={handleChange}
                placeholder="Enter your skills (comma separated)"
                className="form-input"
              />
            </div>
            <div className="form-section">
            <label>
        Enable:
        <input type="checkbox" name="enable" checked={profile.enable} onChange={handleChange} />
      </label>
            </div>
            <h4>Education</h4>
            {profile.education.map((edu) => (
              <div key={edu.id} className="education-item">
                <div className="form-section">
                  <label htmlFor={`major-${edu.id}`}>Major</label>
                  <input
                    name="major"
                    id={`major-${edu.id}`}
                    value={edu.major}
                    onChange={(e) => handleEducationChange(edu.id, e)}
                    placeholder="Major"
                    className="form-input"
                  />
                </div>

                <div className="form-section">
                  <label htmlFor={`university-${edu.id}`}>University</label>
                  <input
                    name="university"
                    id={`university-${edu.id}`}
                    value={edu.university}
                    onChange={(e) => handleEducationChange(edu.id, e)}
                    placeholder="University"
                    className="form-input"
                  />
                </div>

                <div className="form-section">
                  <label htmlFor={`graduationYear-${edu.id}`}>Graduation Year</label>
                  <input
                    name="graduationYear"
                    id={`graduationYear-${edu.id}`}
                    value={edu.graduationYear}
                    onChange={(e) => handleEducationChange(edu.id, e)}
                    placeholder="Graduation Year"
                    className="form-input"
                  />
                </div>

                <button type="button" className="delete-btn" onClick={() => deleteEducation(edu.id)}>
  <Trash size={18} />
</button>
              </div>
            ))}
            <button type="button" className="add-education-btn" onClick={addEducation}>
              <PlusCircle size={16} className="inline mr-1" />
              Add Education
            </button>

            <button type="submit" className="save-btn">Save</button>
          </form>
          */