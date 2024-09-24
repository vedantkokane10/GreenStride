import {React,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import './userHomeStyle.css';
import carbonEarth2 from '../assets/carbonEarth2.png';
import {AuthContext} from '../context/AuthContext';
import Leaderboard from './Leaderboard';
const UserHome = () => {
  const {setAuthenticated} = useContext(AuthContext)
  const navigate = useNavigate();
  const addActivity = () => {
    navigate('/addActivity');
  };
  const trackFootprints = () => {
    navigate('/getActivity');
  };
  const getSuggestions = () => {
    navigate('/suggestion');
  };
  const dashboard = () => {
    navigate('/dashboard');
  };
  const leaderboard = () => {
    navigate('/leaderboard');
  };
  return (
    <div className='page-content'>
      <div className='image-part'>
        <img src={carbonEarth2} alt="Earth" />
      </div>

      <div className='text-part'>
        <h4 style={{color:"black"}}>Track Your Impact, Save Our Planet</h4>
      </div>
      <div className='bottom-part'>
        <button onClick={addActivity}>Add Today's Activities</button>
        <button onClick={trackFootprints}>Track Footprints</button>
        <button onClick={dashboard}>Your Dashboard</button>
        <button onClick={getSuggestions}>Get Suggestions to Reduce Footprints</button>
        <button onClick={leaderboard}>Leaderboard</button>
      </div>
    </div>
  );
};

export default UserHome;
