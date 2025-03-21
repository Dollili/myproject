import {createBrowserRouter} from "react-router-dom";
import App from "./App";
import NotFound from "./pages/NotFound";
import Board from "./pages/board/Board";
import BoardDetail from "./pages/board/BoardDetail";
import ProtectedRoute from "./ProtectedRoute";
import Home from "./pages/Home";
import UserInfo from "./pages/user/UserInfo";
import Error from "./pages/Error";
import Header from "./components/Header";
import Footer from "./components/Footer";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        errorElement: <NotFound/>,
        children: [
            {path: "", element: <Home/>},
            {
                path: "info",
                element: (
                    <>
                        <Header/>
                        <UserInfo/>
                        <Footer/>
                    </>
                ),
            },
            {
                path: "board",
                element: <ProtectedRoute/>, // 보호된 경로 그룹
                children: [
                    {
                        index: true,
                        element: <Board/>,
                    },
                    {path: ":no", element: <BoardDetail/>},
                ],
            },
            {path: "/error", element: <Error/>},
        ],
    },
]);
export default router;
