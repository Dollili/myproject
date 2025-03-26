import React, {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {dbPost} from "../assets/api/commonApi";
import {toast} from "react-toastify";
import Register from "./user/Register";
import "../assets/css/login.css";
import {UserContext} from "../components/UserContext";

const Home = () => {
    const {user, setUser} = useContext(UserContext);
    const nav = useNavigate();
    const [container, setContainer] = useState(null);

    const [userlogin, setLogin] = useState({
        id: "",
        pwd: "",
    });

    const userObj = (e) => {
        let {name, value} = e.target;
        if (name === "id") {
            value = value.toUpperCase();
        }
        setLogin({...userlogin, [name]: value});
    };

    const role_check = () => {
        if (userlogin.id === "testadmin") {
            userlogin["role"] = "M";
        } else {
            userlogin["role"] = "U";
        }
    };

    const login = async () => {
        role_check();
        if (userlogin.id.length === 0 || userlogin.pwd.length === 0) {
            return toast.warn("아이디 혹은 비밀번호를 입력해주세요.");
        }
        try {
            const res = await dbPost("/auth/login", userlogin);
            if (res.info) {
                toast.success("로그인 성공", {
                    autoClose: 500,
                    onClose: () => {
                        setUser(res.info);
                        sessionStorage.setItem("user_Token", JSON.stringify(res.info));
                        nav("/board")
                    },
                });
            } else {
                toast.error("로그인 실패");
            }
        } catch (e) {
            if (e.status === 400) {
                return toast.warn("로그인 실패");
            }
            nav("/error", {state: e.status});
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            login();
        }
    };

    const toggle = () => {
        setContainer((prev) => !prev);
    };

    useEffect(() => {
        const toggle = setTimeout(() => {
            setContainer(true);
        }, 200);
        return () => clearTimeout(toggle);
    }, []);

    return (
        <>
            <div
                id="container"
                className={`container ${container === null ? "" : container ? "sign-in" : "sign-up"}`}
            >
                {sessionStorage.getItem("user_Token") == null ? (
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
                                            placeholder="아이디"
                                            onChange={(e) => {
                                                userObj(e);
                                            }}
                                            onKeyDown={handleKeyDown}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <i className="bx bxs-lock-alt"></i>
                                        <input
                                            name="pwd"
                                            type="password"
                                            placeholder="비밀번호"
                                            onChange={(e) => {
                                                userObj(e);
                                            }}
                                            onKeyDown={handleKeyDown}
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
                                        <b>비밀번호를 잊으셨나요?</b>
                                    </p>
                                    <p>
                                        <span>계정이 없으신가요? </span>
                                        <b onClick={() => toggle()} className="pointer">
                                            회원 가입
                                        </b>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="row">
                        <div className="col align-items-center flex-col sign-up"></div>
                        <div className="col align-items-center flex-col sign-in">
                            <p>Go to board</p>
                            <h4
                                className="goHome"
                                onClick={() => {
                                    nav("board");
                                }}
                            >
                                Click
                            </h4>
                        </div>
                    </div>
                )}
                <div className="row content-row">
                    <div className="col align-items-center flex-col">
                        <div className="text sign-in">
                            <h2>I-CURSOR</h2>
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
        </>
    );
};

export default Home;
