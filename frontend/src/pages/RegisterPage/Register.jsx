import React from 'react';
import {useState} from 'react';
import API from '../../utils/api.js';
import { useNavigate } from 'react-router-dom';
import '../../styles/loginStyles.css'
import {AuthContext} from '../../context/AuthContext';
import { useContext } from 'react';

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



const Register = () => {
  const {setAuthenticated} = useContext(AuthContext)
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [country, setCountry] = useState('');

  const emailChange = (event) =>{
    setEmail(event.target.value);
  }

  const passwordChange = (event) =>{
    setPassword(event.target.value);
  }

  const userNameChange = (event) =>{
    setUserName(event.target.value);
  }

  const setCountryHandler = (event) =>{
    let selectedCountry = event.target.value;
    setCountry(selectedCountry);
    console.log(selectedCountry);
  }

  const handleRegister = async (event) =>{
    event.preventDefault(); // to prevent reloading
    try{
        const response = await API.post('authentication/register',{userName,email,password,country});
        localStorage.setItem('accessToken',response.data.result.accessToken);
        localStorage.setItem('refreshToken',response.data.result.refreshToken);
        setAuthenticated(true);
        navigate('/userHome');
    }
    catch(error){
        console.error(error);
        alert('Failed to register');
    }
  }

  return (
    <div>
         <div className="background-overlay"></div>
        <form onSubmit={handleRegister}>
            <h1 style={{color:"black"}}>Register!</h1>
            <input type='text' name='username' placeholder='username' value={userName} onChange={userNameChange} />
            <input type='email' name='email' placeholder='email' value={email} onChange={emailChange} />
            <input type='password' name='password' placeholder='password' value={password} onChange={passwordChange} />
            <select name="country"  value={country} onChange={setCountryHandler} required>
              <option value="">
                select country
              </option>
              {
                countries.map((country, index) =>(
                  <option key={index} value={country.name}>{country.name} {country.flag}</option>
                ))
              }
            </select>


            <button type='submit' className='formButton'>Register</button>
        </form>
    </div>
  )
};

export default Register;