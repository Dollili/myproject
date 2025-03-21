import React, {useContext, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {dbPost} from "../assets/api/commonApi";
import {UserContext} from "./UserContext";

const Header = () => {
    const {user, setUser} = useContext(UserContext);
    const nav = useNavigate();

    const [onOff, setOn] = useState(false);

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

    useEffect(() => {
        setOn(true);
    }, [user]);

    return (
        <>
            <header className="App-header">
                <Link
                    className="logo"
                    to="/board"
                    style={{color: "white", textDecorationLine: "none"}}
                >
                    TEST
                </Link>
                {onOff && (
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
            {/*<SideMenu onOff={onOff}/>*/}
        </>
    );
};
export default Header;
