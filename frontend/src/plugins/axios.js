import axios from 'axios';

const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3080/api/v1/'
    : 'https://eco-courtyard.herokuapp.com/api/v1/';

axios.defaults.baseURL = BASE_URL;
axios.defaults.withCredentials = true;

export default axios;
