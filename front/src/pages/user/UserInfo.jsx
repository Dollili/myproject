import {useNavigate} from "react-router-dom";
import {dbGet, dbPost, dbPut} from "../../assets/api/commonApi";
import React, {useContext, useEffect, useState} from "react";
import "../../assets/css/login.css";
import {Table} from "react-bootstrap";
import eyeIcon from "../../assets/img/free-icon-eye-4818558.png";
import {UserContext} from "../../components/UserContext";
import {toast, ToastContainer} from "react-toastify";

const UserInfo = () => {
    const nav = useNavigate();
    const {user, setUser} = useContext(UserContext);

    const [mod, setMod] = useState(true);
    const [msg, setMsg] = useState("");

    const [res, setRes] = useState({});
    const [board, setBoard] = useState([]);
    const [comment, setComment] = useState([]);
    const [pastNic, setPast] = useState("");

    const userInfo = (e) => {
        const {name, value} = e.target;
        setRes({...res, [name]: value});
    };

    const getInfo = async () => {
        try {
            const res = await dbGet("/auth/user", {id: user.USER_ID});

            if (res.info) {
                const data = res.info;
                setRes({
                    name: data.USER_NM,
                    nic: data.USER_NIC,
                    id: data.USER_ID,
                    pwd: "",
                    pwd2: "",
                    date: data.REGISTER_DATE,
                });
                setPast(data.USER_NIC);

                if (res.boardList) {
                    setBoard(res.boardList);
                }
                if (res.commentList) {
                    setComment(res.commentList);
                }
            } else {
                toast.warn("정보를 가져올 수 없습니다.");
            }
        } catch (e) {
            nav("/error", {state: e.status});
        }
    };

    const modInfo = async () => {
        if (res.nic?.trim() === "관리자") {
            return toast.warn("사용하실 수 없는 닉네임입니다.");
        }
        if (res.nic?.length > 0 || (res.pwd?.length > 0 && res.pwd2?.length > 0)) {
            try {
                if (res.pwd !== res.pwd2) {
                    return toast.warn("비밀번호가 일치하지 않습니다.");
                }
                const result = await dbPut("/auth/user", res);
                if (result === 204) {
                    toast.success("수정 완료. 재로그인 하시길 바랍니다.", {
                        onClose: async () => {
                            await dbPost("/auth/logout", {});
                            setUser(null);
                            sessionStorage.removeItem("user_Token");
                            window.location.href = "/";
                        },
                    });
                }
            } catch (e) {
                if (e.status === 418) {
                    return toast.warn("사용 중인 닉네임입니다.");
                }
                nav("/error", {state: e.status});
            }
        }
    };

    useEffect(() => {
    }, [res]);

    useEffect(() => {
        getInfo().then(() => setMsg("sign-up"));
    }, []);

    return (
        <div className="main-container">
            <div className="user-container sign-up">
                <div className="form-wrapper align-items-center">
                    <div className={`form ${msg}`}>
                        <h4>회원정보</h4>
                        <div className="input-group">
                            <input name="name" value={res.name || ""} disabled/>
                        </div>
                        <div className="input-group">
                            <input
                                name="nic"
                                value={res.nic}
                                onChange={(e) => {
                                    userInfo(e);
                                }}
                                placeholder="닉네임"
                                readOnly={mod}
                            />
                        </div>
                        <div className="input-group">
                            <input name="id" value={res.id || ""} disabled/>
                        </div>
                        <div className="input-group">
                            <input
                                name="pwd"
                                type="password"
                                value={res.pwd || ""}
                                placeholder="새 비밀번호"
                                onChange={(e) => {
                                    userInfo(e);
                                }}
                                readOnly={mod}
                            />
                        </div>
                        <div className="input-group">
                            <input
                                name="pwd2"
                                type="password"
                                value={res.pwd2 || ""}
                                placeholder="비밀번호 확인"
                                onChange={(e) => {
                                    userInfo(e);
                                }}
                                readOnly={mod}
                            />
                        </div>
                        <div className="input-group">
                            가입일자
                            <input name="date" value={res.date || ""} disabled/>
                        </div>
                        {mod ? (
                            <button
                                onClick={() => {
                                    setMod(false);
                                }}
                            >
                                수정하기
                            </button>
                        ) : (
                            <button
                                className="complete"
                                onClick={() => {
                                    setMod(true);
                                    modInfo();
                                }}
                            >
                                수정 완료
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div className="user-container2 sign-up write">
                <div className="form-wrapper align-items-center">
                    <div className={`form ${msg} form-2`}>
                        <h4>작성한 글</h4>
                        <div className="input-group">
                            <Table striped bordered hover className="board">
                                <colgroup>
                                    <col style={{width: "50%"}}/>
                                    <col style={{width: "30%"}}/>
                                    <col style={{width: "10%"}}/>
                                    <col style={{width: "10%"}}/>
                                </colgroup>
                                <thead>
                                <tr>
                                    <th>제목</th>
                                    <th>날짜</th>
                                    <th>추천</th>
                                    <th>
                                        <img
                                            src={eyeIcon}
                                            alt="조회수"
                                            style={{width: "20px", height: "20px"}}
                                        />
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {board.length === 0 ? (
                                    <tr>
                                        <td colSpan={4}>작성한 글이 존재하지 않습니다.</td>
                                    </tr>
                                ) : (
                                    board.map((item, idx) => (
                                        <tr key={idx}>
                                            <td
                                                onClick={() => {
                                                    nav(`/board/${item.NO}`, {state: item.NO});
                                                }}
                                            >
                                                {item.TITLE}
                                            </td>
                                            <td>{item.APPLY_FORMAT_DATE}</td>
                                            <td>{item.RECOMMEND}</td>
                                            <td>{item.VIEW_CNT}</td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
            <div className="user-container3 sign-up write">
                <div className="form-wrapper align-items-center">
                    <div className={`form ${msg} form-3`}>
                        <h4>작성한 댓글</h4>
                        <div className="input-group">
                            <Table striped bordered hover className="board">
                                <colgroup>
                                    <col style={{width: "60%"}}/>
                                    <col style={{width: "40%"}}/>
                                </colgroup>
                                <thead>
                                <tr>
                                    <th>댓글</th>
                                    <th>날짜</th>
                                </tr>
                                </thead>
                                <tbody>
                                {comment.length === 0 ? (
                                    <tr>
                                        <td colSpan={2}>작성한 댓글이 존재하지 않습니다.</td>
                                    </tr>
                                ) : (
                                    comment.map((item, idx) => (
                                        <tr key={idx}>
                                            <td
                                                onClick={() => {
                                                    nav(`/board/${item.BOARD_NO}`, {
                                                        state: item.BOARD_NO,
                                                    });
                                                }}
                                            >
                                                {item.COMMENT}
                                            </td>
                                            <td>{item.APPLY_FORMAT_DATE}</td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </Table>
                            <p>※ 댓글 클릭 시 해당 글로 이동</p>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer
                toastStyle={{maxWidth: "100%", width: "auto", whiteSpace: "nowrap"}}
                theme="light"
                position="top-center"
                limit={1}
                closeButton={false}
                autoClose={2000}
                hideProgressBar
            />
        </div>
    );
};

export default UserInfo;
