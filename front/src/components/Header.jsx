import React, {useContext, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {dbPost} from "../services/commonApi";
import "../styles/css/menu.css";
import {UserContext} from "../contexts/UserContext";
import {toast} from "react-toastify";
import ToastCon from "./ToastCon";

const Header = ({toggle}) => {
    const {user, setUser} = useContext(UserContext);
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

    const refreshToken = async (id) => {
        try {
            toast.dismiss(id);
            const res = await dbPost("/auth/refresh", {});
            if (res.result === "success") {
                return res.time;
            }
        } catch (e) {
            toast.error("연장 실패");
        }
    };

    // 자동 로그아웃 타이머 설정

    useEffect(() => {
        const interval = setInterval(async () => {
            const expire = new Date(parseInt(sessionStorage.getItem("time")));
            const now = new Date();
            const diff = expire - now;

            if (Math.floor(diff / 1000) === 300) {
                const toastId = toast.info(
                    <div className="remainInfo">
                        <h6>자동 로그아웃 안내</h6>
                        <div>로그아웃까지 5분 남았습니다.</div>
                        <div>계속 이용 하시려면 로그인 시간을 연장해주세요.</div>
                        <button
                            className="remainTime-btn remainLogin"
                            onClick={() => refreshToken(toastId).then(time => {
                                if (time) {
                                    sessionStorage.setItem("time", time);
                                }
                            })}
                        >
                            로그인 시간 연장하기
                        </button>
                        <button
                            className="remainTime-btn"
                            onClick={() => toast.dismiss(toastId)}
                        >
                            닫기
                        </button>
                    </div>,
                    {autoClose: false},
                );
            }

            if (diff <= 0) {
                clearInterval(interval);
                toast.info("로그인 시간이 만료되었습니다.");
                logout();
            }
        }, 1000);

        return () => clearInterval(interval); // 컴포넌트 unmount 시 정리
    }, []);

    return (
        <>
            <header className="App-header">
                <button className="roundButton" onClick={toggle}/>
                <Link
                    className="logo"
                    to="/img"
                >
                    I-CURSOR
                </Link>
                <div className="menu">
                    <p onClick={() => info()}>내정보</p>
                    <p onClick={() => logout()}>로그아웃</p>
                </div>
            </header>
            <ToastCon autoClose={1000}/>
        </>
    );
};

export default Header;
