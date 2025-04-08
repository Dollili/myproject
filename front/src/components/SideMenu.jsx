import React from "react";
import "../styles/css/menu.css";
import {useNavigate} from "react-router-dom";

const SideMenu = ({onOff}) => {
    const nav = useNavigate();

    return (
        <div className="App-side">
            <div className={`dropdown ${onOff ? "active" : ""}`}>
                <div className="menu-item" onClick={() => nav("/notice")}>공지사항</div>
                <div className="menu-item" onClick={() => nav("/board")}>게시판</div>
                <div className="menu-item">금주 랭킹</div>
                <div className="menu-item">사용자</div>
                <div className="menu-item">QnA</div>
            </div>
        </div>
    );
};

export default SideMenu;
