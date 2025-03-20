import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {dbPost} from "../assets/api/commonApi";
import {toast} from "react-toastify";
import Register from "./user/Register";
import "../assets/css/login.css";

const Home = () => {
    const nav = useNavigate();
    const [container, setContainer] = useState(null);

    const [user, setUser] = useState({
        id: "",
        pwd: "",
    });
    const [check, setCheck] = useState(false);

    const userObj = (e) => {
        const {name, value} = e.target;
        setUser({...user, [name]: value});
    };

    const role_check = () => {
        if (user.id === "testadmin") {
            user["role"] = "M";
        } else {
            user["role"] = "U";
        }
    };

    const login = async () => {
        role_check();
        try {
            const res = await dbPost("/auth/login", user);
            if (res) {
                sessionStorage.setItem("user_Token", JSON.stringify(res));
                toast.success("로그인 성공", {
                    autoClose: 500,
                    onClose: () => nav("/board"),
                });
            } else {
                toast.error("로그인 실패");
            }
        } catch (e) {
            nav("/error", {state: e.status});
        }
    };

    const toggle = () => {
        if (container) {
            container.classList.toggle("sign-in");
            container.classList.toggle("sign-up");
        }
    };

    useEffect(() => {
        const containerEl = document.getElementById("container");
        setContainer(containerEl);

        if (containerEl) {
            setTimeout(() => {
                containerEl.classList.add("sign-in");
            }, 200);
        }
    }, []);

    return (
        <>
            {sessionStorage.getItem("user_Token") == null && (
                <div id="container" className="container">
                    <div className="row">
                        <Register toggle={toggle}/>
                        <div className="col align-items-center flex-col sign-in">
                            <div className="form-wrapper align-items-center">
                                <div className="form sign-in">
                                    <div className="input-group">
                                        <i className="bx bxs-user"></i>
                                        <input
                                            name="id"
                                            type="text"
                                            placeholder="Username"
                                            onChange={(e) => {
                                                userObj(e);
                                            }}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <i className="bx bxs-lock-alt"></i>
                                        <input
                                            name="pwd"
                                            type="password"
                                            placeholder="Password"
                                            onChange={(e) => {
                                                userObj(e);
                                            }}
                                        />
                                    </div>
                                    <button
                                        onClick={() => {
                                            login();
                                        }}
                                    >
                                        로그인
                                    </button>
                                    <p>
                                        <b>Forgot password?</b>
                                    </p>
                                    <p>
                                        <span>Don't have an account? </span>
                                        <b onClick={() => toggle()} className="pointer">
                                            Sign up here
                                        </b>
                                    </p>
                                </div>
                            </div>
                            <div className="form-wrapper"></div>
                        </div>
                    </div>
                    <div className="row content-row">
                        <div className="col align-items-center flex-col">
                            <div className="text sign-in">
                                <h2>TEST PAGE</h2>
                            </div>
                            <div className="img sign-in"></div>
                        </div>
                        <div className="col align-items-center flex-col">
                            <div className="img sign-up"></div>
                            <div className="text sign-up">
                                <h2>회원 가입</h2>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Home;
