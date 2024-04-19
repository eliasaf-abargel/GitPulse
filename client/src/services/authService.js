import axios from 'axios';

const API_URL = 'http://localhost:5001/api/auth';

const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data.token;
};

const authService = {
  login,
};

export default authService;