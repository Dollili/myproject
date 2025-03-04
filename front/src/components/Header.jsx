import React from "react";

const Header = () => {
  return (
    <>
      <header className="App-header">
        <p
          className="logo"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          HOME
        </p>
      </header>
    </>
  );
};
export default Header;
