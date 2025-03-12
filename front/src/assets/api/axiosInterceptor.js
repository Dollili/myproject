import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8088",
    withCredentials: false,
    timeout: 0,
});

api.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response && error.response.status === 401) {
            window.location.href = "/";
        }
        return Promise.reject(error);
    },
);

export default api;
