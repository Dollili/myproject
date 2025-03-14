import React, {useState} from "react";
import SideMenu from "./SideMenu";
import {Link, useNavigate} from "react-router-dom";
import {dbPost} from "../assets/api/commonApi";

const Header = () => {
    const item = sessionStorage.getItem("user_Token");
    const nav = useNavigate();

    const [onOff, SetOn] = useState(true);

    const close = () => {
        SetOn(!onOff);
    };

    const info = () => {
        if (item) {
            nav("/info", {state: {id: JSON.parse(item).USER_ID}});
        } else {
            nav("/register");
        }
    };

    const logout = async () => {
        try {
            await dbPost("login/logout", {});
            sessionStorage.removeItem("user_Token");
            nav("/");
        } catch (e) {
            console.log("Logout Failed", e);
        }
    };

    return (
        <>
            <header className="App-header">
                <Link
                    className="logo"
                    to={"board"}
                    style={{color: "white", textDecorationLine: "none"}}
                >
                    홈화면
                </Link>
                {item && (
                    <p className="menu" onClick={() => logout()}>
                        로그아웃
                    </p>
                )}
                <p className="menu" onClick={() => info()}>
                    내정보
                </p>
                <p className="menu" onClick={() => close()}>
                    메뉴
                </p>
            </header>
            <SideMenu onOff={onOff}/>
        </>
    );
};
export default Header;
