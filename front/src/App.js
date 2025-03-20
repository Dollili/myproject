import "./App.css";
import React from "react";
import {Outlet} from "react-router-dom";
import {UserProvider} from "./components/UserContext";

const App = () => {
    return (
        <div className="App">
            <UserProvider>
                <Outlet/>
            </UserProvider>
        </div>
    );
};

export default App;
