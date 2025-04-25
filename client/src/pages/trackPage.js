import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/track.css';
import { Trash2 , Search,Funnel} from 'lucide-react';
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
const TrackPage=() =>{
  //const Enable= true; // or false
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({
    company: '',
    role: '',
    status: 'applied'
  });
  const [editingJob, setEditingJob] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('dateModified');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [searchTerm, setSearchTerm] = useState('');

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

    

   
   getUser();fetchJobs();
  }, [navigate]);

  useEffect(() => {
    fetchJobs();
  }, [sortBy, sortOrder, filterStatus, searchTerm]);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:6005/api/track/get',{
        withCredentials: true,
       params: {
          sortBy,
          order: sortOrder,
          status: filterStatus !== 'all' ? filterStatus : undefined,
          search: searchTerm || undefined
        }
        });
        
      let filtered = response.data;

      setJobs(filtered);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    }
  };


  const fetchJobss = async () => {
    try {
      const response = await axios.get('http://localhost:6005/api/track/gets',{
        withCredentials: true},
       {params: {
          sortBy:'dateModified',
          order: 'DESC',
      }
        });
      setJobs(response.data);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    }
  };
  const handleJobSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:6005/api/track/create', {   ...newJob
      }, {
        withCredentials: true
      });
      setNewJob({ company: '', role: '', status: 'applied' });
      /*if(!Enable){*/
        fetchJobs();
        /*}else{
          fetchJobss();
        }*/
        setShowForm(false);
    } catch (error) {
      console.error('Failed to add job:', error);
      alert('Failed to add job. Please try again.');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await axios.delete(`http://localhost:6005/api/track/delete/${jobId}`,{  withCredentials: true
        });
           /*if(!Enable){*/
           fetchJobs();
           /*}else{
             fetchJobss();
           }*/
      } catch (error) {
        console.error('Failed to delete job:', error);
        alert('Failed to delete job. Please try again.');
      }
    }
  };

  const handleEditClick = (job) => {
    setEditingJob({ ...job, status: job.status.toLowerCase() });
    setIsEditing(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `http://localhost:6005/api/track/update/${editingJob.id}`,
        {
          company: editingJob.company,
          role: editingJob.role,
          status: editingJob.status
        },
        { withCredentials: true }
      );  if (response.data) {
        setJobs(jobs.map(job => 
          job.id === editingJob.id ? response.data : job
        ));
        setIsEditing(false);
      }
      fetchJobs();
    } catch (error) {
      console.error('Update failed:', error);
      alert(`Update failed: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingJob({ ...editingJob, [name]: value });
  };

  return (
    <div>
      <Navbar />
  
    <div className="track-page">
      <div className="track-container">
        <div className='track-head'> <h1>Job Application Tracker</h1>
        <p>Track and manage your job applications</p></div>
        <div className="filter-sort-controls">
         <div className='input-box'>
          <Search size={15}/>
          <input
            type="text"
            placeholder="Search company or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          </div>
          <div className='status-filter'>
            <Funnel size={15}/>
         <select onChange={(e) => setFilterStatus(e.target.value)} value={filterStatus} >
           <option value="all">  All Status    </option>
           <option value="applied">Applied</option>
           <option value="interview">Interview</option>
           <option value="offer">Offer</option>
           <option value="rejected">Rejected</option>
          </select>
          </div>

          <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}  className='sort'>
            <option value="dateModified"> SORT BY Date Modified</option>
            <option value="dateApplied">SORT BY Date Applied</option>
           </select>

          <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
             <option value="DESC"> DESCENDING </option>
             <option value="ASC"> ASCENDING </option>
          </select>

          <div className="add-app">
          <button onClick={() => setShowForm(true)} className="open-form-btn">
            + Add Application
          </button>

          {showForm && (
            <div className="modal-overlay" onClick={() => setShowForm(false)}>
              <div className="job-form" onClick={(e) => e.stopPropagation()}>
                <h2>Add New Application</h2>
                <form onSubmit={handleJobSubmit}>
                  <button className="close-btn" onClick={() => setShowForm(false)}>✖</button>
                  <input
                    type="text"
                    placeholder="Company"
                    value={newJob.company}
                    onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Role"
                    value={newJob.role}
                    onChange={(e) => setNewJob({ ...newJob, role: e.target.value })}
                    required
                  />
                  <select
                    value={newJob.status}
                    onChange={(e) => setNewJob({ ...newJob, status: e.target.value })}
                  >
                    <option value="applied">Applied</option>
                    <option value="interview">Interview</option>
                    <option value="offer">Offer</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <button type="submit">Add</button>
                </form>
              </div>
            </div>
          )}
        </div>

        </div>

        <div className="job-lis">
          {jobs.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Date Applied</th>
                  <th>Date Modified</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td className="company-col">{job.company}</td>
                    <td>{job.role}</td>
                    <td>
                      <span className={`status-${job.status}`}>{job.status}</span>
                    </td>
                    <td>{new Date(job.dateapplied).toLocaleDateString()}</td>
                    <td>{new Date(job.datemodified).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => handleEditClick(job)} className="edi-btn">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteJob(job.id)} className="bin-btn">
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No job applications yet.</p>
          )}
        </div>

        {isEditing && (
          <div className="modal-overlay">
            <div className="edit-modal">
              <h2>Edit Application</h2>
              <form onSubmit={handleEditSubmit}>
                <div className="form-group">
                  <label>Company</label>
                  <input
                    type="text"
                    name="company"
                    value={editingJob.company}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <input
                    type="text"
                    name="role"
                    value={editingJob.role}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={editingJob.status}
                    onChange={handleEditChange}
                  >
                    <option value="applied">Applied</option>
                    <option value="interview">Interview</option>
                    <option value="offer">Offer</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setIsEditing(false)} className="cancel-btn">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>  </div>
  );
};

export default TrackPage;