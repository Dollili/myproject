import React from "react";
import "../assets/css/menu.css";

const SideMenu = ({onOff}) => {
    return (
        <div className="App-side">
            <div className={`dropdown ${onOff ? "active" : ""}`}>
                <div>공지사항</div>
                <div>QnA</div>
                <div>금주 랭킹</div>
                <div>사용자</div>
            </div>
        </div>
    );
};

export default SideMenu;
