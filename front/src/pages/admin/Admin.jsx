import React, {useContext, useState} from "react";
import {toast} from "react-toastify";
import {dbPost} from "../../services/commonApi";
import {UserContext} from "../../contexts/UserContext";
import {useNavigate} from "react-router-dom";
import ToastCon from "../../components/ToastCon";

const Admin = () => {
    const nav = useNavigate();
    const {user, setUser} = useContext(UserContext);
    const [adminLogin, setLogin] = useState({
        id: "",
        pwd: "",
        role: "M",
    });

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            login();
        }
    };

    const adminObj = (e) => {
        let {name, value} = e.target;
        if (name === "id") {
            value = value.toUpperCase();
        }
        setLogin({...adminLogin, [name]: value});
    };

    const login = async () => {
        if (adminLogin.id.length === 0 || adminLogin.pwd.length === 0) {
            return toast.warn("아이디 혹은 비밀번호를 입력해주세요.");
        }
        try {
            const res = await dbPost("/auth/login", adminLogin);
            if (res) {
                toast.success("로그인 성공", {
                    autoClose: 500,
                    onClose: () => {
                        setUser(res);
                        sessionStorage.setItem("user_Token", JSON.stringify(res));
                        nav("/board");
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

    return (
        <>
            <div className="row">
                <div className="col align-items-center flex-col sign-in">
                    <div className="form-wrapper align-items-center">
                        <div className="form sign-in" style={{transform: "unset"}}>
                            <div className="input-group">
                                <i className="bx bxs-user"></i>
                                <input
                                    name="id"
                                    type="text"
                                    placeholder="아이디"
                                    onChange={(e) => {
                                        adminObj(e);
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
                                        adminObj(e);
                                    }}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>
                            <button
                                onClick={() => {
                                    login();
                                }}
                            >
                                관리자 로그인
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <ToastCon autoClose={1000}/>
        </>
    );
};

export default Admin;
