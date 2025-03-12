import {createBrowserRouter} from "react-router-dom";
import App from "./App";
import NotFound from "./pages/NotFound";
import Board from "./pages/board/Board";
import BoardDetail from "./pages/board/BoardDetail";
import ProtectedRoute from "./ProtectedRoute";
import Register from "./pages/user/Register";
import Home from "./pages/Home";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        errorElement: <NotFound/>,
        children: [
            {path: "", element: <Home/>},
            {path: "register", element: <Register/>},
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
        ],
    },
]);
export default router;
