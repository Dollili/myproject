import React, {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {dbPost} from "../services/commonApi";
import {toast} from "react-toastify";
import Register from "./user/Register";
import "../styles/css/login.css";
import {UserContext} from "../contexts/UserContext";

const Home = () => {
    const {user, setUser} = useContext(UserContext);
    const nav = useNavigate();
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
        try {
            const res = await dbPost("/auth/login", userlogin);
            if (res) {
                toast.success("로그인 성공", {
                    autoClose: 500,
                    onClose: () => {
                        setUser(res);
                        sessionStorage.setItem("user_Token", JSON.stringify(res));
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
                                    <div style={{display: "flex", justifyContent: "center"}}>
                                        <p>
                                            <b>비밀번호 찾기</b> {/*구현해야함 ㅋㅋ*/}
                                        </p>
                                        &nbsp;
                                        <p>
                                            <b>|</b>
                                        </p>
                                        &nbsp;
                                        <p>
                                            <b onClick={() => toggle()} className="pointer">회원가입</b>
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
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
