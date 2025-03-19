import {toast} from "react-toastify";

export const customAlert = (msg, callback) => {
    alert(msg);
    callback();
};

export const showAlert = (msg) => {
    toast.warn(msg);
};
