import React, {useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {dbPost} from "../assets/api/commonApi";

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
        const res = await dbPost("/auth/login", user);
        if (res) {
            alert("로그인 성공");
            sessionStorage.setItem("user_Token", JSON.stringify(res));
            nav("board");
        } else {
            alert("로그인 실패");
        }
    };

    useEffect(() => {
    }, [check, user]);

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
