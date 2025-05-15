import React, {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {dbPost} from "../services/commonApi";
import {toast} from "react-toastify";
import Register from "./user/Register";
import "../styles/css/login.css";
import {UserContext} from "../contexts/UserContext";

const Home = () => {
    const nav = useNavigate();
    const {user, setUser} = useContext(UserContext);
    const [container, setContainer] = useState(null);

    const [userlogin, setLogin] = useState({
        id: "",
        pwd: "",
        role: "U",
    });

    const userObj = (e) => {
        let {name, value} = e.target;
        if (name === "id") {
            value = value.toUpperCase();
        }
        setLogin({...userlogin, [name]: value});
    };

    const login = async () => {
        if (userlogin.id.length === 0 || userlogin.pwd.length === 0) {
            return toast.warn("아이디 혹은 비밀번호를 입력해주세요.");
        }
        let toastId;
        try {
            toastId = toast.loading("로그인 중 ...");
            const res = await dbPost("/auth/login", userlogin);
            if (res) {
                toast.update(toastId, {
                    render: "로그인 성공",
                    type: "success",
                    isLoading: false,
                    autoClose: 500,
                    onClose: () => {
                        setUser(res.result);
                        sessionStorage.setItem("user", JSON.stringify(res.result));
                        sessionStorage.setItem("time", res.time);
                        nav("/img");
                    },
                });
            }
        } catch (e) {
            if (e.status === 403) {
                return toast.update(toastId, {
                    render: "아이디 또는 비밀번호가 올바르지 않습니다.",
                    type: "warning",
                    isLoading: false,
                    autoClose: 1000,
                });
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
                <div className="circle circle-1"></div>
                <div className="circle circle-2"></div>
                {user.USER_ID === "" ? (
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
                                    <button
                                        className="move_home"
                                        onClick={() => {
                                            toast.warn(
                                                <div style={{whiteSpace: "pre-wrap", justifyContent: "center"}}>
                                                    비회원으로 이용 중입니다.
                                                    <br/>글 작성이 제한됩니다.
                                                </div>,
                                                {
                                                    onClose: () => {
                                                        nav("/img");
                                                    },
                                                },
                                            );
                                        }}
                                    >
                                        탐방하러 가기
                                    </button>
                                    <div style={{display: "flex", justifyContent: "center"}}>
                                        <p>
                                            <b onClick={() => nav("/find")} className="pointer">
                                                비밀번호 찾기
                                            </b>
                                        </p>
                                        &nbsp;
                                        <p>
                                            <b>|</b>
                                        </p>
                                        &nbsp;
                                        <p>
                                            <b onClick={() => toggle()} className="pointer">
                                                회원가입
                                            </b>
                                        </p>
                                    </div>
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
                                    nav("/img");
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
                        <div className="text sign-up"></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
