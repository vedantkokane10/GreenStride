import React, { useState, useEffect, useContext } from 'react';
import API from '../../utils/api.js';
import {AuthContext} from '../../context/AuthContext';
import '../../styles/dashboardStyle.css'


let config = {
    method:'get',
    url:'/activity/leaderboard',
    headers:{
        'Accept': 'application/json'
    },
    data:{},
    responseType: 'json',
    responseEncoding: 'utf8'
};

const Leaderboard = () => {
    const {setAuthenticated} = useContext(AuthContext)
    const [leaderboardUsers, setLeaderboardUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        setAuthenticated(true);
        const getLeaderboardUsers = async () => {
            try {
                //const response = await API.get('/activity/leaderboard');
                
                let response = await API.request(config);

                console.log(response.data);
                setLeaderboardUsers(response.data.result);

            } catch (error) {
                setError('Failed to fetch leaderboard data');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        
        getLeaderboardUsers();
    }, [setAuthenticated]);

    if (loading) return <p style={{color:"black"}}>Loading...</p>;
    if (error) return <p style={{color:"black"}}>{error}</p>;

    return (
        <div style={{color:"black"}}>
            <h2>Leaderboard for this Month!</h2>
            {leaderboardUsers.length === 0 ? (
                <h3>No activities found</h3>
            ) : (
                <table id='records' style={{border:"1px solid black"}}>
                    <thead>
                        <tr>
                            <th>Position</th>
                            <th>User ID</th>
                            <th>Total CO2 Emission (kg)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboardUsers.map((user, index) => (
                            <tr key={user.username}>
                                <td>{index + 1}</td>
                                <td>{user.username}</td>
                                <td>{Math.round(user.totalemission * 100) / 100}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Leaderboard;
