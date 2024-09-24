import {React,useContext} from 'react';
import './greetStyle.css';
import footprintImage from '../assets/footprintImage.png';
import { useNavigate } from 'react-router-dom';
import greenEarth from '../assets/earthGreen.png';

import {AuthContext} from '../context/AuthContext';
const GreetPage = () => {
  const {setAuthenticated} = useContext(AuthContext)
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };
  const handleRegisterClick = () => {
    navigate('/register');
  };
  return (
    <div className='greeting-page'>
      <div className="background-overlay"></div>
      <div className='content'>
        <div className='image-part'>
          <img src={greenEarth} alt="Foot" />
        </div>
        <div className='right-part'>
          <p style={{color:"black"}}>Take the First Step Towards a Greener Future</p>   


        <div className="container">
            <div className="button-section">
                <button className="btn" onClick={handleLoginClick}>Login</button>
                <button className="btn" onClick={handleRegisterClick}>Register</button>
            </div>
        </div>


          
          
        </div>
      </div>
    </div>
  );
};


export default GreetPage;