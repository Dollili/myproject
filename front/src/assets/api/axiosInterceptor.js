import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8088",
    withCredentials: true,
});

/*api.interceptors.response.use(
    function (res) {
        return res;
    },
    function (error) {
        if (error.response && error.response.status === 401) {
        }
        return Promise.reject(error);
    },
);*/

export default api;
