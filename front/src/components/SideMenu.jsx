import React, {useContext, useEffect, useState} from "react";
import "../styles/css/menu.css";
import {useNavigate} from "react-router-dom";
import {UserContext} from "../contexts/UserContext";

const SideMenu = ({onOff}) => {
    const nav = useNavigate();
    const {user, setUser} = useContext(UserContext);
    const [role, setRole] = useState(false);

    useEffect(() => {
        if (user) {
            user.ROLE === "M" ? setRole(true) : setRole(false);
        }
    }, []);

    return (
        <div className="App-side">
            <div className={`dropdown ${onOff ? "active" : ""}`}>
                <div className="menu-item" onClick={() => nav("/notice")}>
                    공지사항
                </div>
                <div className="menu-item" onClick={() => nav("/img")}>
                    그림판
                </div>
                <div className="menu-item" onClick={() => nav("/board")}>
                    자유게시판
                </div>
                <div className="menu-item" onClick={() => nav("/ranking")}>금주 랭킹</div>
                <div className="menu-item" onClick={() => nav("/qna")}>QnA</div>
                {role && <div className="menu-item" onClick={() => nav("/userBoard")}>사용자 통계</div>}
            </div>
        </div>
    );
};

export default SideMenu;
