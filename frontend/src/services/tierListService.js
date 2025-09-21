import axios from 'axios';

const API_URL = '/api/tier-lists';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const tierListService = {
  async getTierLists({ page = 1, limit = 10, sort = 'newest', search = '' } = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sort,
      ...(search && { search })
    });

    const response = await axios.get(`${API_URL}?${params}`);
    return response.data;
  },

  async getTierListById(id) {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  async createTierList(tierListData) {
    const response = await axios.post(API_URL, tierListData, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  async updateTierList(id, data) {
    const response = await axios.put(`${API_URL}/${id}`, data, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  async deleteTierList(id) {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  async toggleLike(id) {
    const response = await axios.post(`${API_URL}/${id}/like`, {}, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  async getUserTierLists({ page = 1, limit = 10 } = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    const response = await axios.get(`/api/users/my-tier-lists?${params}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  async getTierListsByUser(userId, { page = 1, limit = 10 } = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    const response = await axios.get(`${API_URL}/user/${userId}?${params}`);
    return response.data;
  }
};

export default tierListService;