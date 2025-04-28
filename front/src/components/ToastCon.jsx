import {ToastContainer} from "react-toastify";
import React from "react";

const ToastCon = ({autoClose}) => {
    return (
        <ToastContainer
            toastStyle={{maxWidth: "100%", width: "auto", whiteSpace: "nowrap"}}
            theme="light"
            position="top-center"
            limit={1}
            closeButton={false}
            autoClose={autoClose}
            hideProgressBar
        />
    )
}
export default ToastCon;