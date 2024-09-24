import React from 'react';
import {useState} from 'react';
import API from '../utils/api.js';
import { useNavigate } from 'react-router-dom';
import './loginStyles.css'
import {AuthContext} from '../context/AuthContext';
import { useContext } from 'react';

const Register = () => {
  const {setAuthenticated} = useContext(AuthContext)
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const emailChange = (event) =>{
    setEmail(event.target.value);
  }

  const passwordChange = (event) =>{
    setPassword(event.target.value);
  }

  const userNameChange = (event) =>{
    setUserName(event.target.value);
  }

  const handleRegister = async (event) =>{
    event.preventDefault(); // to prevent reloading
    try{
        const response = await API.post('authentication/register',{userName,email,password});
        localStorage.setItem('accessToken',response.data.accessToken);
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
            <button type='submit' className='formButton'>Register</button>
        </form>
    </div>
  )
};

export default Register;