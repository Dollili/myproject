import {createBrowserRouter} from "react-router-dom";
import App from "./App";
import NotFound from "./pages/NotFound";
import Board from "./pages/board/Board";
import BoardDetail from "./pages/board/BoardDetail";
import ProtectedRoute from "./ProtectedRoute";
import Home from "./pages/Home";
import UserInfo from "./pages/user/UserInfo";
import Error from "./pages/Error";
import Notice from "./pages/notice/Notice";
import NoticeDetail from "./pages/notice/NoticeDetail";
import Admin from "./pages/admin/Admin";
import ImgBoard from "./pages/imgboard/ImgBoard";
import ImgBoardDetail from "./pages/imgboard/ImgBoardDetail";
import Qna from "./pages/qna/Qna";
import QnaDetail from "./pages/qna/QnaDetail";
import Rank from "./pages/ranking/Rank";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <>
                <App/>
            </>
        ),
        errorElement: <NotFound/>,
        children: [
            {path: "", element: <Home/>},
            {path: "admin", element: <Admin/>},
            {
                path: "info",
                element: <ProtectedRoute/>,
                children: [
                    {
                        index: true,
                        element: <UserInfo/>,
                    },
                ],
            },
            {
                path: "img",
                element: <ProtectedRoute/>, // 보호된 경로 그룹
                children: [
                    {
                        index: true,
                        element: <ImgBoard/>,
                    },
                    {path: ":no", element: <ImgBoardDetail/>},
                ],
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
            {
                path: "notice",
                element: <ProtectedRoute/>, // 보호된 경로 그룹
                children: [
                    {
                        index: true,
                        element: <Notice/>,
                    },
                    {path: ":no", element: <NoticeDetail/>},
                ],
            },
            {
                path: "qna",
                element: <ProtectedRoute/>, // 보호된 경로 그룹
                children: [
                    {
                        index: true,
                        element: <Qna/>,
                    },
                    {path: ":no", element: <QnaDetail/>},
                ],
            },
            {
                path: "ranking",
                element: <ProtectedRoute/>, // 보호된 경로 그룹
                children: [
                    {
                        index: true,
                        element: <Rank/>,
                    },
                    /*{path: ":no", element: <QnaDetail/>},*/
                ],
            },
            {path: "/error", element: <Error/>},
        ],
    },
]);
export default router;
