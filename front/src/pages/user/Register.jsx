import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";
import del_icon from "../../assets/img/free-icon-remove-1828843.png";
import suc_icon from "../../assets/img/free-icon-success-11433360.png";
import {dbPost} from "../../services/commonApi";

const Register = ({toggle}) => {
    const nav = useNavigate();
    const [user, setUser] = useState({
        name: "",
        id: "",
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
                if (e.status === 409) {
                    return toast.warn("이미 사용중인 ID 입니다.", {
                        autoClose: 1500,
                    });
                } else if (e.status === 418) {
                    return toast.warn("이미 사용중인 닉네임 입니다.", {
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
                            회원 가입
                        </button>
                        <p>
                            <b onClick={() => toggle()} className="pointer">
                                LOGIN
                            </b>
                        </p>
                    </div>
                </div>
                <ToastContainer
                    theme="light"
                    position="top-center"
                    limit={1}
                    closeButton={false}
                    autoClose={1000}
                    hideProgressBar
                />
            </div>
        </>
    );
};

export default Register;
