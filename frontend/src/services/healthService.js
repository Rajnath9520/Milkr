import api from './api';

const healthService = {
  // GET /health -> backend health endpoint (axios baseURL already points to /api)
    getHealth: async () => {
      try {
        const res = await api.get('/health');
        return res.data;
      } catch (err) {
        throw err;
      }
    }
};

export default healthService;
