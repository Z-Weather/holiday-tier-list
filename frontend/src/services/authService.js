import axios from 'axios';

const API_URL = '/api/auth';

const authService = {
  async login(email, password) {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  },

  async register(username, email, password) {
    const response = await axios.post(`${API_URL}/register`, { username, email, password });
    return response.data;
  },

  async getCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const response = await axios.get(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async updateProfile(profileData) {
    const token = localStorage.getItem('token');
    const response = await axios.put('/api/users/profile', profileData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
  }
};

export default authService;