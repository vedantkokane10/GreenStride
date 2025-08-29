import React, { useState, useEffect, useContext } from 'react';
import API from '../../utils/api.js';
import {AuthContext} from '../../context/AuthContext';
import '../../styles/dashboardStyle.css'


const ActivitiesDateWise = () => {
  const {setAuthenticated} = useContext(AuthContext)
  const [activities, setActivities] = useState([]);
  const accessToken = localStorage.getItem('accessToken');
  
  useEffect(() => {
    setAuthenticated(true);
    const getActivities = async () => {
      try {
        const response = await API.get('/activity/getActivities', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        
        setActivities(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    getActivities();
  }, [accessToken]);

  const activitiesByDate = {}; // mapping of activities to dates
  activities.forEach((activity) => {
    const date = activity.dateadded.split('T')[0];

    // if date is not present in activitiesByDate then add it with empty object
    if (!activitiesByDate[date]) {
      activitiesByDate[date] = {};
    }

    // if date is present in activitiesByDate but the activity type is not present then add with 0 value
    if (!activitiesByDate[date][activity.type]) {
      activitiesByDate[date][activity.type] = 0;
    }

    // sum up each activity type in the activitiesByDate
    activitiesByDate[date][activity.type] += activity.carbonEmission;
  });

  console.log(activitiesByDate);

  return (
    <div>
      <h2>Activities Date-Wise</h2>
      {Object.entries(activitiesByDate).map(([date, types]) => (
        <div key={date}>
          <h3>{date}</h3>
          <ul>
            {Object.entries(types).map(([type, carbonEmission]) => (
              <li key={type}>
                {type}: {carbonEmission} kg CO2
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ActivitiesDateWise;
