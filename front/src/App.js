import "./App.css";
import React from "react";
import {Outlet} from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";

const App = () => {
    return (
        <div className="App">
            <Header/>
            <div className="App-main">
                <Outlet/>
            </div>
            <Footer/>
        </div>
    );
};

export default App;
