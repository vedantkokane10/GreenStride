import axios from 'axios';

const API = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/'
});

API.interceptors.request.use((req) =>{
    if(localStorage.getItem('accessToken')){
        req.headers['x-auth-token'] =  localStorage.getItem('accessToken');
    }
    return req;
});

export default API;
