import axios from 'axios';
import authHeader from './auth-header';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const API_URL = `${API_BASE_URL}/api/`;

class UserService {
    getPublicContent() {
        return axios.get(API_URL + 'test/all');
    }

    getUserBoard() {
        return axios.get(API_URL + 'test/user', { headers: authHeader() });
    }

    getAdminBoard() {
        return axios.get(API_URL + 'test/admin', { headers: authHeader() });
    }

    getUserStats(userId) {
        return axios.get(API_URL + `users/${userId}/stats`, { headers: authHeader() });
    }

    getTotalScore() {
        return axios.get(API_URL + 'total-score', { headers: authHeader() });
    }
}

const userServiceInstance = new UserService();
export default userServiceInstance;