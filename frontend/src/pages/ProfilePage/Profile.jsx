import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {AuthContext} from '../../context/AuthContext';
import '../../styles/profileStyles.css'

const Profile = () => {
  const { setAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    carbonGoal: ''
  });


  const user = {
    name:"jojo",
    email:"test@",
    bio:"hssh",
    carbonGoal:"sjsj"

  }
  useEffect(() => {
    
    setAuthenticated(true);
   if (user) {
      // Load user data from context or API
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        carbonGoal: user.carbonGoal || ''
      });
    }
    
  }, [setAuthenticated, navigate]);

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your API call to update profile here
    try {
      // Example: await updateProfile(profileData);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setAuthenticated(false);
    navigate('/login');
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <h2>{profileData.name || 'User'}</h2>
          <p className="profile-email">{profileData.email}</p>
        </div>

        <div className="profile-content">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleChange}
                  placeholder="Your email"
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Monthly Carbon Footprint Goal (kg CO₂)</label>
                <input
                  type="number"
                  name="carbonGoal"
                  value={profileData.carbonGoal}
                  onChange={handleChange}
                  placeholder="e.g., 500"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-save">Save Changes</button>
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <div className="info-section">
                <h3>About</h3>
                <p>{profileData.bio || 'No bio added yet.'}</p>
              </div>

              <div className="info-section">
                <h3>Carbon Goal</h3>
                <p>{profileData.carbonGoal ? `${profileData.carbonGoal} kg CO₂/month` : 'No goal set'}</p>
              </div>

              <div className="profile-actions">
                <button 
                  className="btn-edit"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
                <button 
                  className="btn-logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;