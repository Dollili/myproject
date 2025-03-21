import {Navigate, Outlet} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

const ProtectedRoute = () => {
    const isAuth = !!sessionStorage.getItem("user_Token");

    return isAuth ? <><Header/><Outlet/><Footer/></> : <Navigate to="/" replace={true}/>;
};

export default ProtectedRoute;
