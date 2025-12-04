import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {AuthContext} from '../../context/AuthContext';
import '../../styles/profileStyles.css'
import API from '../../utils/api';
import {BlogCardProfile} from '../../components/BlogCardProfile';


let config = {
  method:'',
  url:'',
  headers:{
      'Accept': 'application/json'
  },
  data:{},
  responseType: 'json',
  responseEncoding: 'utf8'
};

const countries = [
  { name: "USA", flag: "🇺🇸" },
  { name: "India", flag: "🇮🇳" },
  { name: "China", flag: "🇨🇳" },
  { name: "UK", flag: "🇬🇧" },
  { name: "Germany", flag: "🇩🇪" },
  { name: "France", flag: "🇫🇷" },
  { name: "Japan", flag: "🇯🇵" },
  { name: "Australia", flag: "🇦🇺" },
  { name: "Canada", flag: "🇨🇦" },
  { name: "Brazil", flag: "🇧🇷" },
  { name: "Norway", flag: "🇳🇴" },
  { name: "South Africa", flag: "🇿🇦" },
  { name: "UAE", flag: "🇦🇪" },
  { name: "Netherlands", flag: "🇳🇱" },
  { name: "Singapore", flag: "🇸🇬" },
  { name: "South Korea", flag: "🇰🇷" },
  { name: "Mexico", flag: "🇲🇽" },
];


const Profile = () => {
  const { setAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    country:''
  });

  const [coutryChanged, setCoutryChanged] = useState(false);

  const [blogs, setBlogs] = useState([]);

  
  useEffect(() => {
   setAuthenticated(true);
   const fetchUserData = async() =>{
      try {
        //const response = await API.get('/authentication/user');
        config.url = '/authentication/user';
        config.method = 'get';
        let response = await API.request(config);
        console.log(response);
        setProfileData({
          name: response.data.result.username || '',
          email: response.data.result.email|| '',
          country: response.data.result.country || '',
        });
      } 
      catch (error) {
        console.log("Error fetching current user",error)
      }
   }
   const fetchUserBlogs = async() =>{
    try {
      //const response = await API.get('/blog/user-blogs');

      config.url = '/blog/user-blogs';
      config.method = 'get';
      let response = await API.request(config);


      setBlogs(response.data.result.result);
      console.log(response.data.result.result);
    } 
    catch (error) {
      console.log("Error fetching current user's blogs",error)
    }
 }
   fetchUserData();
   fetchUserBlogs();
    
  }, [setAuthenticated, navigate]);

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const changeCountry = async(event) =>{
    try {
      setCoutryChanged(true);
      setProfileData(prev =>({
        ...prev,
        country:event.target.value
      }))

    } catch (error) {
      
    }
  }
  const updateCountry = async() =>{
    try {
      //const response = await API.patch('/authentication/user', {country:profileData.country});  
      config.url = '/authentication/user';
      config.method = 'patch';
      config.data = {country:profileData.country};
      let response = await API.request(config);
      if(response.status === 200){
        alert("Updated country");
        console.log(response);
        setCoutryChanged(false);
      }
    } 
    catch (error) {
      console.log(error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      
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
      
      <div className='profile-container'>
        <div className='profile-info'>
          <h3>UserName - {profileData.name}</h3>
          <h3>Email - {profileData.email}</h3>
          <select name="country"  value={profileData.country} onChange={changeCountry} required>
              <option value="">
                select country
              </option>
              {
                countries.map((country, index) =>(
                  <option key={index} value={country.name}>{country.name} {country.flag}</option>
                ))
              }
            </select>

            {
                coutryChanged ? <button  onClick={updateCountry}>Update country</button> : ''
            }
        </div>
        
        <div className='profile-blogs'>
            {
            blogs.map((blog, index) =>{
              return <BlogCardProfile title={blog.title} content={blog.content} id={blog._id} /> 
            })
            }
        </div>
      </div>
    </div>
  );
};

export default Profile;