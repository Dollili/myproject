import {toast} from "react-toastify";
import React from "react";

export const customAlert = (msg, callback) => {
    alert(msg);
    callback();
};

export const showAlert = (msg) => {
    toast.warn(msg);
};

export const deleteAlert = (msg, func, no) => {
    const toastId = toast.info(
        <div className="remainInfo">
            <div>{msg}</div>
            <button
                className="remainTime-btn remainLogin"
                onClick={() => {
                    if (no) {
                        func(no);
                    } else {
                        func();
                    }
                    toast.dismiss(toastId);
                }}
            >
                확인
            </button>
            <button
                className="remainTime-btn"
                onClick={() => toast.dismiss(toastId)}
            >
                닫기
            </button>
        </div>,
        {autoClose: false},
    )
}