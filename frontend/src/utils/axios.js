import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/V1', // Update this to match your backend URL
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
