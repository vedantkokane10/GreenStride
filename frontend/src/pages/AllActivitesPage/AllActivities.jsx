// import React from 'react';
// import API from '../../utils/api.js';

// import { useState } from 'react';
// import { useEffect, useContext } from 'react';
// import '../../styles/allActivitiesStyle.css'

// import { AuthContext } from '../../context/AuthContext';



// const AllActivities = () => {
//   const {setAuthenticated} = useContext(AuthContext)
//   const [activities, setActivities] = useState([]);
//   const [activitiesNew, setActivitiesNew] = useState([]);
//   const accessToken = localStorage.getItem('accessToken');
//   useEffect(() =>{
//     setAuthenticated(true);
//     const getAtivities = async () => {
//         try{
//             const response = await API.get('/activity/');
//             const newActicity = [];
//             setActivities(response.data.result);
//             console.log(response.data);
//             console.log(activities);
//         }
//         catch(error){
//             console.error(error);
//         }
//     }
//     getAtivities();
//   },[]);

//   const ActivityType = (activity) =>{
//     if(activity === "carTravel"){
//         return "Car Travel";
//     }
//     else if(activity === "riceConsumption"){
//         return "Rice Consumption";
//     }
//     else if(activity === "lpgUsage"){
//         return "LPG Gas Usage";
//     }
//     else if(activity === "airTravel"){
//         return "Air Travel";
//     }
//     else if(activity === "twoWheelerTravel"){
//         return "Two-Wheeler Travel";
//     }
//     else if(activity === "electricity"){
//         return "Electricity Consumption";
//     }
//   }

//   return (
//     <div>
//         <h2 style={{color:"black"}}>Your Recent Activities</h2>
//         {activities.length === 0 ? 
//         <h3 style={{color:"black"}}>No activities Found</h3>
//         : 
//         <table id='records' style={{color:"black", border: "1px solid black"}}>
//             <tr style={{color:"black", border: "1px solid black"}}>
//                 <th>Date</th>
//                 <th>Activity</th>
//                 <th>CO2 Emission in kg</th>
//             </tr>
//             {activities.map((activity) => (

//             <tr style={{color:"black", border: "1px solid black"}}>
//                 <td>{activity.dateadded.split('T')[0]}</td>
//                 <td>{ActivityType(activity.type)}</td>
//                 <td>{Math.round(activity.carbonemission * 100) / 100}</td>
//             </tr>
//             ))}
//         </table>
//         }
        
//     </div>
//   )
// }

// export default AllActivities;

import React, { useState, useEffect, useContext } from "react";
import API from "../../utils/api.js";
import "../../styles/allActivitiesStyle.css";
import { AuthContext } from "../../context/AuthContext";

const AllActivities = () => {
  const { setAuthenticated } = useContext(AuthContext);

  const [activities, setActivities] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  // Start with base URL
  const [url, setUrl] = useState("/activity?limit=5");

  useEffect(() => {
    setAuthenticated(true);

    const getActivities = async () => {
      try {
        const response = await API.get(url);
        console.log(response.data);
        setActivities(response.data.result.result);
        setNextPage(response.data.result.result.next ? response.data.next.url.replace("/api", "") : null);
        setPrevPage(response.data.resul.result.previous ? response.data.previous.url.replace("/api", "") : null);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    getActivities();
  }, [url, setAuthenticated]);

  const ActivityType = (activity) => {
    switch (activity) {
      case "carTravel":
        return "Car Travel";
      case "riceConsumption":
        return "Rice Consumption";
      case "lpgUsage":
        return "LPG Gas Usage";
      case "airTravel":
        return "Air Travel";
      case "twoWheelerTravel":
        return "Two-Wheeler Travel";
      case "electricity":
        return "Electricity Consumption";
      default:
        return activity;
    }
  };

  return (
    <div>
      <h2 style={{ color: "black" }}>Your Recent Activities</h2>
      {activities.length === 0 ? (
        <h3 style={{ color: "black" }}>No activities Found</h3>
      ) : (
        <>
          <table id="records" style={{ color: "black", border: "1px solid black" }}>
            <thead>
              <tr style={{ border: "1px solid black" }}>
                <th>Date</th>
                <th>Activity</th>
                <th>CO2 Emission (kg)</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity, index) => (
                <tr key={index} style={{ border: "1px solid black" }}>
                  <td>{activity.dateadded.split("T")[0]}</td>
                  <td>{ActivityType(activity.type)}</td>
                  <td>{Math.round(activity.carbonemission * 100) / 100}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Buttons */}
          <div style={{ marginTop: "20px" }}>
            <button
              onClick={() => setUrl(prevPage)}
              disabled={!prevPage}
              style={{ marginRight: "10px", cursor:'pointer', borderRadius:"25px", height:"35px", width:"100px", background:'none' }}
            >
              Previous
            </button>
            <button
              onClick={() => setUrl(nextPage)}
              disabled={!nextPage}
              style={{cursor:'pointer', borderRadius:"25px", height:"35px", width:"100px", background:'none'}}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AllActivities;
