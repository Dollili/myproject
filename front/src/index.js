import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import "./styles/css/board.css";
import "./styles/css/notice.css";
import "./styles/css/grid.css";
import "./styles/css/user.css";
import "react-toastify/dist/ReactToastify.css";

import router from "./router";

import reportWebVitals from "./reportWebVitals";
import {RouterProvider} from "react-router-dom";
import App from "./App";
import {UserProvider} from "./contexts/UserContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <UserProvider>
        <RouterProvider router={router}>
            <App/>
        </RouterProvider>
    </UserProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
