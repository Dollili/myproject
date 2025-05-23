import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import del_icon from "../../assets/img/free-icon-remove-1828843.png";
import suc_icon from "../../assets/img/free-icon-success-11433360.png";
import {dbPost} from "../../services/commonApi";
import ToastCon from "../../components/ToastCon";

const Register = ({toggle}) => {
    const nav = useNavigate();
    const [user, setUser] = useState({
        name: "",
        id: "",
        email: "",
        pwd: "",
        pwd2: "",
    });
    const [inf, setInf] = useState(false);
    const [shake, setShake] = useState(false);

    const objChange = (e) => {
        const {name, value} = e.target;
        if (name === "pwd2") {
            setShake(true);
            setTimeout(() => {
                setShake(false);
            }, 300);
        }
        setUser({...user, [name]: value});
    };

    const crossPwd = () => {
        if (user.pwd.length > 0) {
            user.pwd === user.pwd2 ? setInf(true) : setInf(false);
        }
    };

    const join_check = () => {
        if (user.nic && user.nic.trim() === "관리자") {
            return toast.warn("사용하실 수 없는 닉네임입니다.");
        }
        const name = !!user.name;
        const pwd = user.pwd.length >= 1;
        return name && pwd && inf;
    };

    const join = async () => {
        if (join_check()) {
            try {
                const res = await dbPost("/auth/join", user);
                if (res === "success") {
                    toast.info("회원가입이 완료되었습니다. 로그인 화면으로 이동합니다.", {
                        onClose: () => {
                            window.location.href = "/";
                        },
                    });
                } else {
                    toast.error("회원가입 실패");
                }
            } catch (e) {
                const code = [409, 418, 511, 512];
                const msg = e.response.data;
                if (code.includes(e.status)) {
                    return toast.warn(msg, {
                        autoClose: 1500,
                    });
                }
                nav("/error", {state: e.status});
            }
        } else {
            if (user.pwd.length < 6) {
                return toast.info("비밀번호는 6자리 이상 입력바랍니다.");
            }
            toast.info("모든 정보는 필수 입력입니다.");
        }
    };

    useEffect(() => {
        crossPwd();
    }, [inf, user]);

    useEffect(() => {
    }, [user]);

    return (
        <>
            <div className="col align-items-center flex-col sign-up">
                <div className="form-wrapper align-items-center">
                    <div className="form sign-up">
                        <div className="input-group">
                            <i className="bx bx-mail-send"></i>
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
                                name="nic"
                                type="text"
                                placeholder="닉네임 (미입력 시 아이디로 대체됩니다)"
                                onChange={(e) => {
                                    objChange(e);
                                }}
                            />
                        </div>
                        <div className="input-group">
                            <i className="bx bxs-user"></i>
                            <input
                                className="email"
                                name="email"
                                type="text"
                                placeholder="yourEmail@icursor.com"
                                onChange={(e) => {
                                    objChange(e);
                                }}
                            />
                        </div>
                        <div className="input-group">
                            <i className="bx bxs-lock-alt"></i>
                            <input
                                name="pwd"
                                type="password"
                                placeholder="비밀번호"
                                onChange={(e) => {
                                    objChange(e);
                                }}
                            />
                        </div>
                        <div className="input-group">
                            <i className="bx bxs-lock-alt"></i>
                            <input
                                name="pwd2"
                                type="password"
                                placeholder="비밀번호 확인"
                                onChange={(e) => {
                                    objChange(e);
                                }}
                            />
                        </div>
                        {user.pwd2.length !== 0 && (
                            <div className="pwd_checking">
                                {inf ? (
                                    <div>
                                        <span>Password Correct</span>
                                        <img className="check_fail" src={suc_icon} alt="success"/>
                                    </div>
                                ) : (
                                    <div className={shake ? "shake-text" : ""}>
                                        <span>Password Encorrect</span>
                                        <img className="check_fail" src={del_icon} alt="fail"/>
                                    </div>
                                )}
                            </div>
                        )}
                        <button
                            onClick={() => {
                                join();
                            }}
                        >
                            가입
                        </button>
                        <p>
                            <b onClick={() => toggle()} className="pointer">
                                회원 로그인
                            </b>
                        </p>
                    </div>
                    <div className="social-list sign-up">
                        <p>간편 로그인</p>
                        <div
                            className="google-bg"
                            onClick={() => {
                                window.location.href = process.env.REACT_APP_API_BASE_URL + "/oauth2/authorization/google";
                            }}
                        >
                            <i>Google</i>
                        </div>
                        <div
                            className="kakao-bg"
                            onClick={() => {
                                window.location.href = process.env.REACT_APP_API_BASE_URL + "/oauth2/authorization/kakao";
                            }}
                        >
                            <i>Kakao</i>
                        </div>
                        <div
                            className="naver-bg"
                            onClick={() => {
                                window.location.href = process.env.REACT_APP_API_BASE_URL + "/oauth2/authorization/naver";
                            }}
                        >
                            <i>Naver</i>
                        </div>
                    </div>
                </div>
                <ToastCon autoClose={1000}/>
            </div>
        </>
    );
};

export default Register;
