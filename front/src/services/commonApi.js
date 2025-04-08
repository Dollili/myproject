import api from "./axiosInterceptor";

export const dbGet = async (url, param) => {
    const res = await api.get(url, {params: param});
    return res.data;
};

export const dbPost = async (url, param) => {
    const res = await api.post(url, param);
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

export const dbForm = async (files, no) => {
    if (files) {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append("file", files[i]);
        }
        const url = "/file/upload";
        if (no) {
            formData.append("no", no); // 게시글 번호
        }

        try {
            const res = await api.post(url, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return res.data;
        } catch (error) {
            throw error;
        }
    }
};
