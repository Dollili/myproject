import {Navigate, Outlet} from "react-router-dom";
import {useEffect} from "react";

const ProtectedRoute = () => {
    const isAuth = !!sessionStorage.getItem("user_Token");

    useEffect(() => {
    }, [isAuth]);

    return isAuth ? <Outlet/> : <Navigate to="/" replace={true}/>;
};

export default ProtectedRoute;
