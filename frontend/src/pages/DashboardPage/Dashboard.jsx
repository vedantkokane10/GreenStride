import React from 'react'
import API from '../../utils/api.js';
import { useState, useContext } from 'react';
import { useEffect } from 'react';
import LineChartComponent from '../../components/LineChartComponent';
import { PieChart } from '../../components/PieChart';
import {AuthContext} from '../../context/AuthContext';
import '../../styles/dashboardStyle.css'


const Dashboard = () => {
  const {setAuthenticated} = useContext(AuthContext)
  const [activities, setActivities] = useState([]);
  const accessToken = localStorage.getItem('accessToken');
  useEffect(() =>{
    setAuthenticated(true)
    const getAtivities = async () => {
        try{
            const response = await API.get('/activity/current-month');
            
            setActivities(response.data.result);
            console.log(response.data);
            console.log(activities);
        }
        catch(error){
            console.error(error);
        }
    }
    getAtivities();
  },[setAuthenticated]);

 

  const totalEmissionDateWise = activities.reduce((sum,activity) => {
    const date = activity.dateadded.split('T')[0];
    if(!sum[date]){
      sum[date] = 0;
    }

    sum[date] += activity.carbonemission;
    return sum;
  },{});

  console.log(totalEmissionDateWise); 


  const totalEmissionTypeWise = activities.reduce((sum,activity) => {
    const date = activity.dateadded.split('T')[0];
    const type = activity.type;
    if(!sum[type]){
      sum[type] = 0;
    }

    sum[type] += activity.carbonemission;
    return sum;
  },{});

  return (
    <div className='charts'>
      {
        activities.length === 0 ?
        <h3 style={{color:"black"}}>No Activities found</h3>
        :
        <>
        <h3></h3>
        <LineChartComponent totalEmissionDateWise={totalEmissionDateWise || {}}  />
        <br></br><br></br><br></br><br></br>
        <br></br><br></br>
        <h2 style={{color:"black"}}>Total CO2 Emissions by different types of Activites</h2>
        <PieChart totalEmissionTypeWise={totalEmissionTypeWise || {}}  />
        </>
      }

      

    </div>
  )
}

export default Dashboard;