import React, { useState } from "react";
import SideMenu from "./SideMenu";

const Header = () => {
  const [onOff, SetOn] = useState(true);

  const close = () => {
    SetOn(!onOff);
  };

  return (
    <>
      <header className="App-header">
        <div className="logo">
          <p
            onClick={() => {
              window.location.href = "/";
            }}
          >
            홈화면
          </p>
        </div>
        <p className="menu" onClick={() => close()}>메뉴</p>
      </header>
      <SideMenu onOff={onOff}/>
    </>
  );
};
export default Header;
