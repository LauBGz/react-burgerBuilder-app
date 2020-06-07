import axios from 'axios';

const instance = axios.create({
    baseURL: "https://react-first-app-19e3e.firebaseio.com/"
});

export default instance;    