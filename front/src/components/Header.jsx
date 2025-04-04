import React, {useContext} from "react";
import {Link, useNavigate} from "react-router-dom";
import {dbPost} from "../assets/api/commonApi";
import "../assets/css/menu.css";
import {UserContext} from "./UserContext";

const Header = ({toggle}) => {
    const {user, setUser} = useContext(UserContext);
    const nav = useNavigate();

    const info = () => {
        nav("/info");
    };

    const logout = async () => {
        try {
            await dbPost("/auth/logout", {});
            setUser(null);
            sessionStorage.removeItem("user_Token");
            window.location.href = "/";
        } catch (e) {
            nav("/error", e.status);
        }
    };

    return (
        <>
            <header className="App-header">
                <button
                    className="roundButton"
                    onClick={toggle}
                />
                <Link
                    className="logo"
                    to="/board"
                    style={{color: "white", textDecorationLine: "none"}}
                >
                    I-CURSOR
                </Link>
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
