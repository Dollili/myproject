import React, {useState} from "react";
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {dbPost} from "../assets/api/commonApi";
import {toast, ToastContainer} from "react-toastify";

const Home = () => {
    const nav = useNavigate();

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
        if (check) {
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

    return (
        <>
            {sessionStorage.getItem("user_Token") == null && (
                <div className="App-contents">
                    <div className="login">
                        <div className="login-Form">
                            <input
                                name="id"
                                value={userObj.id}
                                placeholder="id"
                                onChange={(e) => {
                                    userObj(e);
                                }}
                            />
                            <input
                                type="password"
                                name="pwd"
                                value={userObj.pwd}
                                placeholder="password"
                                onChange={(e) => {
                                    userObj(e);
                                }}
                            />
                        </div>
                        <Button
                            onClick={() => {
                                login();
                            }}
                        >
                            로그인
                        </Button>
                        <ToastContainer limit={1} position="top-center" theme="light"/>
                    </div>
                    <div className="choice-Form">
                        <Button
                            onClick={() => {
                                nav("/register");
                            }}
                        >
                            회원가입
                        </Button>
                        <label>
                            관리자
                            <input
                                type="checkbox"
                                checked={check}
                                onChange={() => {
                                    setCheck(!check);
                                }}
                            />
                        </label>
                    </div>
                </div>
            )}
        </>
    );
};

export default Home;
