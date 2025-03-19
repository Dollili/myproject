import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";

const NotFound = () => {
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
                style={{fontSize: "1.5rem", color: "red.600", marginBottom: "20px"}}
            >
                페이지를 찾을 수 없습니다. 이전 화면으로 이동합니다.
            </h1>
            <h2
                style={{fontSize: "1.0rem", color: "gray.600", marginBottom: "20px"}}
            >
                Page not found.
            </h2>
        </div>
    );
};

export default NotFound;
