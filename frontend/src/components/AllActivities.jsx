import React from 'react';
import API from '../utils/api.js';

import { useState } from 'react';
import { useEffect, useContext } from 'react';
import './allActivitiesStyle.css'
import {AuthContext} from '../context/AuthContext';
const AllActivities = () => {
  const {setAuthenticated} = useContext(AuthContext)
  const [activities, setActivities] = useState([]);
  const accessToken = localStorage.getItem('accessToken');
  useEffect(() =>{
    setAuthenticated(true);
    const getAtivities = async () => {
        try{
            const response = await API.get('/activity/getActivities',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
            );
            
            setActivities(response.data);
            console.log(activities);
        }
        catch(error){
            console.error(error);
        }
    }
    getAtivities();
  },[]);
  return (
    <div>
        <h2 style={{color:"black"}}>Your Recent Activities</h2>
        {activities.length === 0 ? 
        <h3 style={{color:"black"}}>No activities Found</h3>
        : 
        <table id='records' style={{color:"black", border: "1px solid black"}}>
            <tr style={{color:"black", border: "1px solid black"}}>
                <th>Date</th>
                <th>Activity</th>
                <th>CO2 Emission in kg</th>
            </tr>
            {activities.map((activity) => (

            <tr style={{color:"black", border: "1px solid black"}}>
                <td>{activity.date.split('T')[0]}</td>
                <td>{activity.type}</td>
                <td>{Math.round(activity.carbonEmission * 100) / 100}</td>
            </tr>
            ))}
        </table>
        }
        
    </div>
  )
}

export default AllActivities;