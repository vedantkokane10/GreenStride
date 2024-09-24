import React from 'react'
import {useState,useContext} from 'react'
import API from '../utils/api.js';
import { useNavigate } from 'react-router-dom';
import './loginStyles.css'
import {AuthContext} from '../context/AuthContext';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Login = () => {
  const {setAuthenticated} = useContext(AuthContext)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const emailChange = (event) =>{
    setEmail(event.target.value);
  }

  const passwordChange = (event) =>{
    setPassword(event.target.value);
  }

  const handleLogin = async (event) =>{
    event.preventDefault();
    try{
        const response = await API.post('/authentication/login',{email,password});
        console.log(response.data.accessToken);
        localStorage.setItem('accessToken',response.data.accessToken);
        // after successful authentication the used will be directed to the userHome component 
        setAuthenticated(true);
        toast.success("Successfully logged in!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        navigate('/userHome');
    }
    catch(error){
        console.error(error);
        alert('Failed to login');
    }  // end try catch block
    
  }
  return (
    <div className='loginPage'>
        <div className="background-overlay"></div>
        <form onSubmit={handleLogin}>
            <h1 style={{color:"black"}}>Login!</h1>
            <input type="email" placeholder='email' value={email} onChange={emailChange} />
            <input type="password" placeholder='password' value={password} onChange={passwordChange}/>

            <button type="submit" className='formButton' style={{border:"1"}}>Login</button>
        </form>
        <ToastContainer />
    </div>
  )
};

export default Login;