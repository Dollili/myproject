import React, {useContext, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {dbPost} from "../services/commonApi";
import "../styles/css/menu.css";
import {UserContext} from "../contexts/UserContext";

const Header = ({toggle}) => {
    const {user, setUser} = useContext(UserContext);

    const [timeLeft, setTimeLeft] = useState(() => {
        const expire = new Date(parseInt(sessionStorage.getItem("time")));
        return expire - new Date();
    });
    const nav = useNavigate();

    const info = () => {
        nav("/info");
    };

    const logout = async () => {
        try {
            await dbPost("/auth/logout", {});
            window.location.href = "/";
            setUser("");
        } catch (e) {
            nav("/error", e.status);
        }
    };
    // 자동 로그아웃 타이머 설정
    useEffect(() => {
        const interval = setInterval(() => {
            const expire = new Date(parseInt(sessionStorage.getItem("time")));
            const now = new Date();
            const diff = expire - now;
            setTimeLeft(diff);

            if (diff <= 0) {
                clearInterval(interval);
                alert("로그인 시간이 만료되었습니다.");
                logout();
            }
        }, 1000);

        return () => clearInterval(interval); // 컴포넌트 unmount 시 정리
    }, []);

    const formatTime = (millis) => {
        const totalSec = Math.floor(millis / 1000);
        const min = Math.floor(totalSec / 60);
        const sec = totalSec % 60;
        return `${min}분 ${sec}초`;
    };

    return (
        <>
            <header className="App-header">
                <button className="roundButton" onClick={toggle}/>
                <Link
                    className="logo"
                    to="/img"
                    style={{color: "white", textDecorationLine: "none"}}
                >
                    I-CURSOR
                </Link>
                <p className="menu">
                    남은 시간: {timeLeft > 0 ? formatTime(timeLeft) : "만료"}
                </p>
                <p className="menu" onClick={() => logout()}>
                    로그아웃
                </p>
                <p className="menu" onClick={() => info()}>
                    내정보
                </p>
            </header>
        </>
    );
};
export default Header;
