import {Navigate, Outlet} from "react-router-dom";

const ProtectedRoute = () => {
    const isAuth = !!sessionStorage.getItem("user_Token");

    return isAuth ? <Outlet/> : <Navigate to="/" replace={true}/>;
};

export default ProtectedRoute;
