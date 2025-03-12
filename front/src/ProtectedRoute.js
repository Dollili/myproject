import {Navigate, Outlet} from "react-router-dom";

const ProtectedRoute = () => {
    const isAuth = !!localStorage.getItem("user_Token");
    return isAuth ? <Outlet/> : <Navigate to="/" replace/>;
};

export default ProtectedRoute;
