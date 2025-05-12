import {Navigate, Outlet, useLocation} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SideMenu from "./components/SideMenu";
import {useEffect, useState} from "react";


const ProtectedRoute = ({adminOnly = false}) => {
    const isAuth = !!sessionStorage.getItem("user");
    const [onOff, setOn] = useState(false);
    const location = useLocation();

    //화면 이동 시 메뉴 닫음
    useEffect(() => {
        setOn(false);
    }, [location]);

    const toggle = () => {
        setOn(!onOff);
    };

    //관리자 혹은 미권한 redirect
    const admin = isAuth?.ROLE === "M"
    if (adminOnly && !admin) {
        return <Navigate to="/login" replace/>;
    }

    return (
        <>
            <Header toggle={toggle}/>
            <SideMenu onOff={onOff}/>
            <Outlet/>
            <Footer/>
        </>
    );
};

export default ProtectedRoute;
