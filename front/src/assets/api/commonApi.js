import api from "./axiosInterceptor";

export const dbGet = async (url, param) => {
    try {
        const res = await api.get(url, {params: param});
        return res.data;
    } catch (e) {
        console.log(e);
    }
};

export const dbPost = async (url, param) => {
    try {
        const res = await api.post(url, param);
        return res.data;
    } catch (e) {
        console.error("fail", e.response);
    }
};

export const dbPut = async (url, param) => {
    try {
        const res = await api.put(url, param);
        return res.status;
    } catch (e) {
        console.log(e);
    }
};

export const dbDelete = async (url, param) => {
    try {
        const res = await api.delete(url, {params: param});
        return res.status;
    } catch (e) {
        console.log(e);
    }
};
