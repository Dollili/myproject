import {createBrowserRouter} from "react-router-dom";
import App from "./App";
import NotFound from "./pages/NotFound";
import Board from "./pages/board/Board";
import BoardDetail from "./pages/board/BoardDetail";

const router = createBrowserRouter(
    [
        {
            path: "",
            element: <App/>,
            errorElement: <NotFound/>,
        },
        {
            path: "board",
            element: <Board/>,
        },
        {
            path: "board/:no",
            element: <BoardDetail/>,
        },
    ],
    {
        basename: "/", // basename 명시적 설정
    },
);

export default router;
