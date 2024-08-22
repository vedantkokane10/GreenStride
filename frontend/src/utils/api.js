import axios from 'axios';

const API = axios.create({
    baseURL: 'https://greenstride.onrender.com/api/'
});

API.interceptors.request.use((req) =>{
    if(localStorage.getItem('accessToken')){
        req.headers['x-auth-token'] =  localStorage.getItem('accessToken');
    }
    return req;
});

export default API;
