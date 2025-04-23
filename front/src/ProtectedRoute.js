import {Navigate, Outlet, useLocation} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SideMenu from "./components/SideMenu";
import {useEffect, useState} from "react";

const ProtectedRoute = () => {
    const isAuth = !!sessionStorage.getItem("user");
    const [onOff, setOn] = useState(false);
    const location = useLocation();


    const toggle = () => {
        setOn(!onOff);
    };

    //화면 이동 시 메뉴 닫음
    useEffect(() => {
        setOn(false)
    }, [location]);

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
