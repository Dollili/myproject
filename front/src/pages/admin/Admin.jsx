import React, {useContext, useState} from "react";
import {toast} from "react-toastify";
import {dbPost} from "../../services/commonApi";
import {useNavigate} from "react-router-dom";
import ToastCon from "../../components/ToastCon";
import {UserContext} from "../../contexts/UserContext";

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
        let toastId;
        try {
            toastId = toast.loading("로그인 중 ...");
            const res = await dbPost("/auth/login", adminLogin);
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
                        nav("/board");
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
