import axios from 'axios';

const API = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/'
});

API.interceptors.request.use((req) =>{
    let token = localStorage.getItem('accessToken');
    if(localStorage.getItem('accessToken')){
        req.headers['Authorization'] =  `Bearer ${token}`;
    }
    return req;
});

export default API;
