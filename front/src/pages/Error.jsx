import {useNavigate} from "react-router-dom";
import React, {useEffect} from "react";

const Error = () => {
    const nav = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            nav(-1);
        }, 2000);
    }, [nav]);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "gray.100",
                padding: "20px",
                textAlign: "center",
            }}
        >
            <h1
                style={{fontSize: "2.5rem", color: "red.600", marginBottom: "20px"}}
            >
                요청 오류 발생. 이전 화면으로 이동합니다.
            </h1>
            <h2
                style={{fontSize: "1.5rem", color: "gray.600", marginBottom: "20px"}}
            >
                UnAuthorization
            </h2>
        </div>
    );
};
export default Error;
