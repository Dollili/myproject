import api from "./axiosInterceptor";

export const dbGet = async (url, param) => {
    const res = await api.get(url, param);
    return res.data;
};

export const dbPost = async (url, param) => {
    const res = await api.post(url, param, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    return res.data;
};

export const dbPut = async (url, param) => {
    const res = await api.put(url, param);
    return res.status;
};

export const dbDelete = async (url, param) => {
    const res = await api.delete(url, {params: param});
    return res.status;
};
