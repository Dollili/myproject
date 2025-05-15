import {useNavigate} from "react-router-dom";
import {dbGet, dbPost, dbPut} from "../../services/commonApi";
import React, {useContext, useEffect, useState} from "react";
import "../../styles/css/login.css";
import {Table} from "react-bootstrap";
import {UserContext} from "../../contexts/UserContext";
import {toast} from "react-toastify";
import ToastCon from "../../components/ToastCon";
import {deleteAlert} from "../../components/alert/customAlert";

const UserInfo = () => {
    const nav = useNavigate();
    const {user, setUser} = useContext(UserContext);

    const [mod, setMod] = useState(true);
    const [msg, setMsg] = useState("");

    const [res, setRes] = useState({});
    const [board, setBoard] = useState([]);
    const [temporary, setTemp] = useState([]);
    const [comment, setComment] = useState([]);

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

                if (res.boardList) {
                    setBoard(res.boardList);
                }
                if (res.commentList) {
                    setComment(res.commentList);
                }
                if (res.tempList) {
                    setTemp(res.tempList);
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
                            sessionStorage.removeItem("user");
                            window.location.href = "/";
                        },
                    });
                }
            } catch (e) {
                if (e.status === 501) {
                    return toast.success("수정 완료", {
                        autoClose: 500,
                        onClose: () => {
                            nav("/board");
                        },
                    });
                }
                if (e.status === 418) {
                    return toast.warn("사용 중인 닉네임입니다.");
                }
                nav("/error", {state: e.status});
            }
        }
    };

    const changeCategory = (val) => {
        switch (val) {
            case "board":
                return "자유게시판";
            case "notice":
                return "공지";
            case "img":
                return "전시회";
            case "qna":
                return "QnA";
            case "rank":
                return "명전";
            default:
                return "no data";
        }
    };

    const deleteUser = async () => {
        try {
            const res = await dbPut("/auth/user/delete", {});
            if (res === 200) {
                toast.success("회원탈퇴 완료. 감사했습니다.", {
                    onClose: () => {
                        nav("/");
                        setUser("");
                    }
                })
            }
        } catch (e) {
            nav("/error", {state: e.status})
        }
    }

    useEffect(() => {
    }, [res]);

    useEffect(() => {
        getInfo().then(() => setMsg("sign-up"));
    }, []);

    return (
        <>
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
                                    className="mod-btn"
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
                                    완료
                                </button>
                            )}
                            <button
                                className="mod-btn delUser"
                                onClick={() => {
                                    deleteAlert("정말 탈퇴하시겠습니까? 😭", deleteUser)
                                }}
                            >
                                회원 탈퇴
                            </button>
                        </div>
                    </div>
                </div>
                <div className="user-container2 sign-up write">
                    <div className="form-wrapper align-items-center">
                        <div className={`form ${msg} form-2`}>
                            <h4>작성한 글</h4>
                            <div className="input-group boardList">
                                <Table striped bordered hover className="board">
                                    <colgroup>
                                        <col style={{width: "20%"}}/>
                                        <col style={{width: "40%"}}/>
                                        <col style={{width: "40%"}}/>
                                    </colgroup>
                                    <thead>
                                    <tr>
                                        <th>구분</th>
                                        <th>제목</th>
                                        <th>작성일</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {board.length === 0 ? (
                                        <tr>
                                            <td colSpan={3}>작성한 글이 존재하지 않습니다.</td>
                                        </tr>
                                    ) : (
                                        board.map((item, idx) => (
                                            <tr key={idx}>
                                                <td className="date">{changeCategory(item.CATEGORY)}</td>
                                                <td
                                                    className="title"
                                                    onClick={() => {
                                                        nav(`/${item.CATEGORY}/${item.NO}`, {
                                                            state: item.NO,
                                                        });
                                                    }}
                                                >
                                                    {item.TITLE}
                                                </td>
                                                <td>{item.APPLY_FORMAT_DATE}</td>
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
                            <div className="input-group boardList">
                                <Table striped bordered hover className="board">
                                    <colgroup>
                                        <col style={{width: "20%"}}/>
                                        <col style={{width: "40%"}}/>
                                        <col style={{width: "40%"}}/>
                                    </colgroup>
                                    <thead>
                                    <tr>
                                        <th>구분</th>
                                        <th>댓글</th>
                                        <th>작성일</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {comment.length === 0 ? (
                                        <tr>
                                            <td colSpan={3}>작성한 댓글이 존재하지 않습니다.</td>
                                        </tr>
                                    ) : (
                                        comment.map((item, idx) => (
                                            <tr key={idx}>
                                                <td className="date">
                                                    {changeCategory(item.CATEGORY)}
                                                </td>
                                                <td
                                                    className="title"
                                                    onClick={() => {
                                                        nav(`/${item.CATEGORY}/${item.BOARD_NO}`, {
                                                            state: item.BOARD_NO,
                                                        });
                                                    }}
                                                >
                                                    {item.COMMENT}
                                                </td>
                                                <td className="date">{item.APPLY_FORMAT_DATE}</td>
                                            </tr>
                                        ))
                                    )}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="user-container4 sign-up write">
                    <div className="form-wrapper align-items-center">
                        <div className={`form ${msg} form-2`}>
                            <h4>저장된 글</h4>
                            <div className="input-group boardList">
                                <Table striped bordered hover className="board">
                                    <colgroup>
                                        <col style={{width: "20%"}}/>
                                        <col style={{width: "40%"}}/>
                                        <col style={{width: "40%"}}/>
                                    </colgroup>
                                    <thead>
                                    <tr>
                                        <th>구분</th>
                                        <th>제목</th>
                                        <th>수정일</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {temporary.length === 0 ? (
                                        <tr>
                                            <td colSpan={3}>작성 중인 글이 존재하지 않습니다.</td>
                                        </tr>
                                    ) : (
                                        temporary.map((item, idx) => (
                                            <tr key={idx}>
                                                <td className="date">
                                                    {changeCategory(item.CATEGORY)}
                                                </td>
                                                <td
                                                    className="title"
                                                    onClick={() => {
                                                        nav(`/${item.CATEGORY}/${item.NO}`, {
                                                            state: item.NO,
                                                        });
                                                    }}
                                                >
                                                    {item.TITLE}
                                                </td>
                                                <td className="date">
                                                    {item.UPDATE_FORMAT_DATE || item.APPLY_FORMAT_DATE}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastCon autoClose={2000}/>
            </div>
            <p style={{textAlign: "center"}}>클릭 시 해당 글로 이동합니다</p>
        </>
    );
};

export default UserInfo;
