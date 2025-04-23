import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    withCredentials: true,
});

api.interceptors.response.use(
    function (res) {
        return res;
    },
    function (error) {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            sessionStorage.clear();
        }
        return Promise.reject(error);
    },
);

export default api;
