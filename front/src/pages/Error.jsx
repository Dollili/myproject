import {useLocation, useNavigate} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import {UserContext} from "../components/UserContext";

const Error = () => {
    const {user} = useContext(UserContext);
    const nav = useNavigate();
    const code = useLocation();
    const [msg, setMsg] = useState("");

    useEffect(() => {
        if (code) {
            switch (code.state) {
                case 400:
                    setMsg("BAD REQUEST: " + code.state);
                    break;
                case 401:
                    setMsg("UNAUTHORIZED: " + code.state);
                    break;
                case 403:
                    setMsg("인증 실패 FORBIDDEN: " + code.state);
                    sessionStorage.clear();
                    break;
                default:
                    setMsg("그외의 문제: " + code.state);
            }
        }
        setTimeout(() => {
            nav('/')
        }, 2000);
    }, []);

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
                요청 오류 발생. 이전 화면으로 이동합니다.
            </h1>
            <h2
                style={{fontSize: "1.0rem", color: "gray.600", marginBottom: "20px"}}
            >
                {msg}
            </h2>
        </div>
    );
};
export default Error;
