import React, {useContext, useState} from "react";
import SideMenu from "./SideMenu";
import {Link, useNavigate} from "react-router-dom";
import {dbPost} from "../assets/api/commonApi";
import {UserContext} from "./UserContext";

const Header = () => {
    const {user} = useContext(UserContext);
    const nav = useNavigate();

    const [onOff, setOn] = useState(true);

    const info = () => {
        if (user) {
            nav("/info", {state: {id: user.USER_ID}});
        } else {
            nav("/register");
        }
    };

    const logout = async () => {
        try {
            await dbPost("/auth/logout", {});
            sessionStorage.removeItem("user_Token");
            window.location.href = "/";
        } catch (e) {
            nav("/error", e.status);
        }
    };

    return (
        <>
            <header className="App-header">
                <Link
                    className="logo"
                    to={"/board"}
                    style={{color: "white", textDecorationLine: "none"}}
                >
                    홈화면
                </Link>
                {user && (
                    <p className="menu" onClick={() => logout()}>
                        로그아웃
                    </p>
                )}
                <p className="menu" onClick={() => info()}>
                    내정보
                </p>
                <p className="menu" onClick={() => {
                }}>
                    메뉴
                </p>
            </header>
            <SideMenu onOff={onOff}/>
        </>
    );
};
export default Header;
