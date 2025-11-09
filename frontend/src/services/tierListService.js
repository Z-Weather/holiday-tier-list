import axios from 'axios';

const API_URL = '/api/tier-lists';

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
    const response = await axios.post(API_URL, tierListData);
    return response.data;
  },

  async updateTierList(id, data) {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  },

  async deleteTierList(id) {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  },

};

export default tierListService;