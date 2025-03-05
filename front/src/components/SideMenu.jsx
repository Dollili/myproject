import React from "react";

const SideMenu = ({ onOff }) => {
  return (
    <div className="App-side">
      <div className={`dropdown ${onOff ? "active" : ""}`}>

      </div>
    </div>
  );
};

export default SideMenu;
