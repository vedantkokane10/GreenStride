import React, { useState, useContext, useEffect } from 'react';
import API from '../utils/api.js';
import './addActivityStyle.css';
import { AuthContext } from '../context/AuthContext';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




const emissionFactors = {
    "carTravel": 0.18,           // kg CO₂e per km (petrol car)
    "electricity": 0.82,         // kg CO₂e per kWh
    "lpgUsage": 2.98,            // kg CO₂e per kg of LPG
    "airTravel": 0.15,           // kg CO₂e per km (domestic flights)
    "riceConsumption": 2.7,      // kg CO₂e per kg of rice
    "busTravel": 0.08,           // kg CO₂e per km
    "trainTravel": 0.03,         // kg CO₂e per km
    "twoWheelerTravel": 0.045,   // kg CO₂e per km
    "milkConsumption": 1.4,      // kg CO₂e per liter of milk
    "waste": 0.25                // kg CO₂e per kg of waste
};

const emissionFactorsNotes = {
    "carTravel": "Please enter the total distance traveled in kilometers. For example, if you ride for 5 km, enter 5 in the field.",
    "electricity": "Please provide the number of hours the device was used and its power rating in watts. For example, if a 100-watt device was used for 5 hours, input 5 hours in quantity field and 100 watts.",
    "lpgUsage": "Please enter the amount of LPG gas used in kilograms (kg). For example, if you've used 2 kg of LPG, input 2 in the field.",
    "riceConsumption": "Please enter the amount of rice consumed in kilograms (kg). For example, if you consumed 2 kg of rice, input 2 kg.",
    "twoWheelerTravel": "Please enter the distance traveled on your private two-wheeler in kilometers (km). For example, if you traveled 10 km, input 10 km."
};

const AddActivity = () => {
    const { setAuthenticated } = useContext(AuthContext);
    const [type, setType] = useState('');
    const [carbonEmission, setCarbonEmission] = useState(0);
    const [electricity, setElectricity] = useState(false);
    const [note, setNote] = useState('');
    const [powerWatt, setPowerWatt] = useState(0);
    const [hours, setHours] = useState(0);

    const typeChange = (event) => {
        const selectedType = event.target.value;
        setType(selectedType);
        setElectricity(selectedType === 'electricity');
        setNote(emissionFactorsNotes[selectedType]);
    };

    const quantityChange = (event) => {
        setCarbonEmission(event.target.value);
    };

    const hoursChange = (event) => {
        setHours(event.target.value);
    };

    const powerWattChange = (event) => {
        setPowerWatt(event.target.value);
    };

    useEffect(() => {
        setAuthenticated(true);
    }, [setAuthenticated]);

    const handleSubmission = async (event) => {
        event.preventDefault();
        try {
            let emission = carbonEmission;
            if (type === 'electricity') {
                emission = (powerWatt / 1000) * hours;
            }
            const response = await API.post('/activity/addActivity', { type, carbonEmission: emission }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            console.log(response.data);
            toast.success("Added New Actitvity!", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              });
            setType('');
            setCarbonEmission(0);
            setPowerWatt(0);
            setHours(0);
        } catch (error) {
            console.error(error);
            alert('Failed to add activity');
            toast.error('Failed to add activity', {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              });
        }
    };

    return (
        <div>
            <h2 style={{ color: "black" }}>Add Activity</h2>
            <form onSubmit={handleSubmission}>
                <label style={{ color: "black" }}>Type:</label>
                <select value={type} onChange={typeChange} required>
                    <option value="" disabled>Choose an option</option>
                    <option value="carTravel">Private Car Travel in km</option>
                    <option value="twoWheelerTravel">Private Two-Wheeler Travel in km</option>
                    <option value="electricity">Electricity Consumption in kWh</option>
                    <option value="lpgUsage">LPG Gas Usage per kg</option>
                    <option value="riceConsumption">Rice Consumption per kg</option>
                </select>

                {electricity ? (
                    <>
                        <label style={{ color: "black" }}>Hours:</label>
                        <input type="number" placeholder='hours' value={hours} onChange={hoursChange} required />
                        <label style={{ color: "black" }}>Power Watt of device:</label>
                        <input type="number" placeholder='power watt' value={powerWatt} onChange={powerWattChange} required />
                    </>
                ) : (
                    <>
                        <label style={{ color: "black" }}>Quantity:</label>
                        <input type="number" placeholder='quantity' value={carbonEmission} onChange={quantityChange} required />
                    </>
                )}

                <button type="submit" className='formButton'>Add</button>
            </form>
            <br/> <br/> <br/> <br/> <br/> <br/>
            <br/> <br/> <br/> <br/> <br/> <br/>
            <br/> <br/> <br/> <br/> <br/> <br/>
            <br/> <br/> <br/> <br/> <br/> <br/>
            <br/> <br/> <br/> <br/> <br/>
            <h3 style={{ color: "black" }}>{note}</h3>
            <ToastContainer />
        </div>
    );
};

export default AddActivity;
