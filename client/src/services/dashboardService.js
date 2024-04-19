import axios from 'axios';

const API_URL = 'http://localhost:5001/api/dashboard';

const getDashboardData = async () => {
  const token = localStorage.getItem('token'); // Replace with your token storage logic

  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

const dashboardService = {
  getDashboardData,
};

export default dashboardService;