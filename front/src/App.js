import "./App.css";
import React from "react";
import {Outlet} from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import {UserProvider} from "./components/UserContext";

const App = () => {
    return (
        <div className="App">
            <UserProvider>
                <Header/>
                <div className="App-main">
                    <Outlet/>
                </div>
                <Footer/>
            </UserProvider>
        </div>
    );
};

export default App;
