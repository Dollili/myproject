import React, {useState} from "react";
import SideMenu from "./SideMenu";
import {Link} from "react-router-dom";

const Header = () => {
    const [onOff, SetOn] = useState(true);

    const close = () => {
        SetOn(!onOff);
    };

    return (
        <>
            <header className="App-header">
                <div className="logo">
                    <Link to={""} style={{color: "white", textDecorationLine: "none"}}>홈화면</Link>
                </div>
                <p className="menu" onClick={() => close()}>
                    메뉴
                </p>
            </header>
            <SideMenu onOff={onOff}/>
        </>
    );
};
export default Header;
