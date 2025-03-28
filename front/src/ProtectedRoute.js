import {Navigate, Outlet} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SideMenu from "./components/SideMenu";
import {useState} from "react";

const ProtectedRoute = () => {
    const isAuth = !!sessionStorage.getItem("user_Token");
    const [onOff, setOn] = useState(false);

    const toggle = () => {
        setOn(!onOff);
    };

    return isAuth ? (
        <>
            <Header toggle={toggle}/>
            <SideMenu onOff={onOff}/>
            <Outlet/>
            <Footer/>
        </>
    ) : (
        <Navigate to="/" replace={true}/>
    );
};

export default ProtectedRoute;
