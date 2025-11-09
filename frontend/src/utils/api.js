import axios from 'axios';

const API = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/'
});

API.interceptors.request.use((req) =>{
    let accesToken = localStorage.getItem('accessToken');
    if(localStorage.getItem('accessToken')){
        req.headers['Authorization'] =  `Bearer ${accesToken}`;
    }
    // if (!req.data) req.data = {};
    // let refreshToken = localStorage.getItem('refreshToken');
    // if(localStorage.getItem('refreshToken')){
    //     req.data.refreshToken = refreshToken;
    // }
    return req;
});


//  Function 1 — Successful response handler
export const successfulResponse = (response) => {
    return response;
};
  
//  Function 2 — Expired access token handler (auto-refresh)
export const expiredAccessTokenResponse = async (error) => {
    const originalRequest = error.config;
    console.log("Request failed:", originalRequest.url, error.response?.status);
    console.log("Original request data:", originalRequest.data); // body checking
  
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      console.log("Attempting token refresh...");
      originalRequest._retry = true;
  
      const refreshToken = localStorage.getItem('refreshToken');
      console.log("Refresh token:", refreshToken ? "EXISTS" : "MISSING");
      
      if (!refreshToken) {
        console.warn("No refresh token found, redirecting to login");
        window.location.href = '/login';
        return Promise.reject(error);
      }
  
      try {
        console.log("Calling refresh endpoint...");
        const res = await axios.post(
          'http://127.0.0.1:8000/api/authentication/refresh',
          { refreshToken }
        );
  
        console.log("Refresh response:", res.status, res.data);
  
        if (res.status === 200 && res.data.accessToken) {
          const newAccessToken = res.data.accessToken;
          localStorage.setItem('accessToken', newAccessToken);
  
          // Clear any body data that was added by request interceptor
          if (originalRequest.data && originalRequest.data.refreshToken) {
            delete originalRequest.data.refreshToken;
          }
          
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          
          console.log("Retrying original request:", originalRequest.url);
          console.log("With data:", originalRequest.data);
          return API(originalRequest);
        }
  
        throw new Error("Failed to refresh access token");
      } 
      catch (refreshErr) {
        console.error('Refresh token failed:', refreshErr.response?.data || refreshErr);
        window.location.href = '/login';
        return Promise.reject(refreshErr);
      }
    }
  
    return Promise.reject(error);
};


API.interceptors.response.use(successfulResponse, expiredAccessTokenResponse);

export default API;
