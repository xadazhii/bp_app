import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

export const fetchSomeData = async () => {
    try {
        const response = await api.get('/api/data'); 
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};
