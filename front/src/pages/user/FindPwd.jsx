import ToastCon from "../../components/ToastCon";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import api from "../../services/axiosInterceptor";

const FindPwd = () => {
    const nav = useNavigate();
    const [user, setUser] = useState({
        name: "",
        id: "",
        email: "",
        code: "",
        pwd: "",
    });
    const [effect, setEffect] = useState("");
    const [auth, setAuth] = useState(false);
    const [codeAuth, setCode] = useState(false);

    const objChange = (e) => {
        const {name, value} = e.target;
        setUser({...user, [name]: value});
    };

    const pwd = async () => {
        try {
            const res = await api.post("/auth/findPwd", user);
            const code = res.status;
            if (code === 200) {
                setAuth(true);
                toast.info(user.email + " 로 인증코드를 보냈습니다.");
            } else if (code === 201) {
                toast.info(res.data, {
                    onClose: () => nav("/"),
                });
            }
        } catch (e) {
            const error_code = [500, 401];
            if (error_code.includes(e.status)) {
                toast.error(e.response.data);
            }
            if (e.status === 404) {
                toast.info(e.response.data);
            }
        }
    };

    useEffect(() => {
        setEffect("sign-up");
    }, []);

    return (
        <>
            <div className={`container ${effect}`}>
                <div className="row">
                    <div className="form-wrapper align-items-center find-wrapper">
                        <div className="form sign-up find">
                            <div className="input-group">
                                <i className="bx bxs-user"></i>
                                <input
                                    name="id"
                                    type="email"
                                    placeholder="아이디"
                                    onChange={(e) => {
                                        objChange(e);
                                    }}
                                />
                            </div>
                            <div className="input-group">
                                <i className="bx bxs-user"></i>
                                <input
                                    name="name"
                                    type="text"
                                    placeholder="이름"
                                    onChange={(e) => {
                                        objChange(e);
                                    }}
                                />
                            </div>
                            <div className="input-group">
                                <i className="bx bxs-user"></i>
                                <input
                                    name="email"
                                    type="text"
                                    placeholder="yourEmail@icursor.com"
                                    onChange={(e) => {
                                        objChange(e);
                                    }}
                                />
                            </div>
                            <button
                                onClick={() => {
                                    if (!auth) {
                                        pwd();
                                    }
                                }}
                                style={auth ? {backgroundColor: "lightseagreen"} : {}}
                            >
                                사용자 인증 {auth ? "✔" : ""}
                            </button>
                            {auth && (
                                <div className="input-group">
                                    <i className="bx bxs-user"></i>
                                    <input
                                        name="code"
                                        type="text"
                                        placeholder="인증코드"
                                        onChange={(e) => {
                                            objChange(e);
                                        }}
                                    />
                                </div>
                            )}
                            <div className="input-group">
                                <i className="bx bxs-user"></i>
                                <input
                                    name="pwd"
                                    type="password"
                                    placeholder="변경할 비밀번호"
                                    onChange={(e) => {
                                        objChange(e);
                                    }}
                                />
                            </div>
                            <button
                                onClick={() => {
                                    pwd();
                                }}
                                disabled={!auth}
                            >
                                비밀번호 변경
                            </button>
                            <div className="homeKey pointer" onClick={() => nav("/")}>
                                🏠 HOME
                            </div>
                        </div>
                    </div>
                    <ToastCon autoClose={1000}/>
                </div>
            </div>
        </>
    );
};

export default FindPwd;
