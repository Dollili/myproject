import api from "./axiosInterceptor";

export const dbGet = async (url, param) => {
    try {
        const res = await api.get(url, {params: param});
        return res.data;
    } catch (e) {
        console.log(e);
        throw e;
    }
};

export const dbPost = async (url, param) => {
    try {
        const res = await api.post(url, param);
        return res.data;
    } catch (e) {
        console.log(e);
        throw e;
    }
};

export const dbPut = async (url, param) => {
    const res = await api.put(url, param);
    return res.status;
};

export const dbDelete = async (url, param) => {
    const res = await api.delete(url, {params: param});
    return res.status;
};
