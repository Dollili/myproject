import "./App.css";
import React from "react";
import {Outlet} from "react-router-dom";

const App = () => {
    return (
        <div className="App">
            <Outlet/>
        </div>
    );
};

export default App;
