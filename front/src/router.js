import {createBrowserRouter, Navigate} from "react-router-dom";
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
import FindPwd from "./pages/user/FindPwd";
import UserBoard from "./pages/admin/UserBoard";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <Home/>,
        errorElement: <NotFound/>,
    },
    {
        path: "/",
        element: <Navigate to="/login" replace/>,
    },
    {path: "find", element: <FindPwd/>, errorElement: <NotFound/>},
    {path: "admin", element: <Admin/>, errorElement: <NotFound/>},
    {
        path: "/",
        element: <ProtectedRoute/>,
        children: [
            {
                path: "info",
                children: [
                    {
                        index: true,
                        element: <UserInfo/>,
                    },
                ],
            },
            {
                path: "img",
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
                children: [
                    {
                        index: true,
                        element: <Rank/>,
                    },
                ],
            },
        ],
        errorElement: <NotFound/>,
    },
    {path: "error", element: <Error/>},
    {
        path: "userBoard",
        element: (
            <>
                <ProtectedRoute adminOnly={true}/>
                <UserBoard/>
            </>
        ),
        errorElement: <NotFound/>,
    },
]);
export default router;
