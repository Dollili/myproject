import React, {useContext, useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import Form from "react-bootstrap/Form";
import {Table} from "react-bootstrap";
import {showAlert} from "../../components/alert/customAlert";
import Comment from "./Comment";
import {dbGet, dbPost, dbPut} from "../../assets/api/commonApi";
import {UserContext} from "../../components/UserContext";
import {toast, ToastContainer} from "react-toastify";
import thumb from "../../assets/img/thumbs_16019896.png";

const BoardDetail = () => {
    const nav = useNavigate();
    const {user, setUser} = useContext(UserContext);

    const [role, setRole] = useState("");

    const location = useLocation();
    const [data, setData] = useState({});

    const [path, setPath] = useState(false);
    const [param, setParam] = useState({author: user.USER_NIC});

    const changeBoard = (e) => {
        const {name, value} = e.target;
        setParam({...param, [name]: value});
    };

    const getDetail = async () => {
        if (location.state) {
            setPath(true);
            try {
                const res = await dbGet("/board/detail", {no: location.state});
                if (res) {
                    setData(res);
                } else {
                    toast.error("조회 오류 발생", {
                        onClose: () => {
                            nav("/board");
                        },
                    });
                }
            } catch (e) {
                nav("/error", {state: e.status});
            }
        } else {
            setPath(false);
        }
    };

    const validation = (param) => {
        if (
            !param ||
            !["title", "contents"].every((key) => param[key] && param[key].length > 0)
        ) {
            return true;
        }
    };

    const append_board = async () => {
        try {
            if (validation(param)) {
                return toast.info("제목과 내용을 모두 입력해주세요.");
            }

            let res;

            if (Object.keys(data).length > 0) {
                res = await dbPut("/board/detail/modify", param);
            } else {
                param['id'] = user.USER_ID;
                res = await dbPost("/board/detail", param);
            }

            if (res === 1 || res === 204) {
                toast.success("등록완료", {
                    autoClose: 500,
                    onClose: () => {
                        nav("/board");
                    },
                });
            } else {
                toast.error("등록실패");
            }
        } catch (e) {
            nav("/error", {state: e.status});
        }
    };

    const updateBoard = (no) => {
        const meta = {
            title: data.TITLE,
            contents: data.CONTENTS,
            author: data.AUTHOR,
            no: no,
        };
        setParam({...param, ...meta});
        setPath(false);
    };

    const deleteBoard = async (no) => {
        try {
            const res = await dbPut("/board/detail", {no});
            if (res === 204) {
                toast.success("삭제완료", {
                    autoClose: 500,
                    onClose: () => {
                        nav("/board");
                    },
                });
            } else {
                toast.error("삭제실패");
            }
        } catch (e) {
            nav("/error", {state: e.status});
        }
    };

    const recommend = async (no) => {
        if (role === "user") {
            return showAlert("본인이 작성한 글에는 추천할 수 없습니다.");
        }

        try {
            const res = await dbPut("/board/detail/recommend", {no: no});
            if (res === 204) {
                getDetail();
            }
        } catch (e) {
            nav("/error", {state: e.status});
        }
    };

    const userCheck = () => {
        if (user.USER_NIC === data.AUTHOR) {
            setRole("user");
        } else if (user.ROLE === "M") {
            setRole("admin");
        }
    };

    useEffect(() => {
        userCheck();
    }, [data, user]);

    useEffect(() => {
        getDetail();
    }, []);

    return (
        <div className="main-container">
            <Table bordered>
                <colgroup>
                    <col style={{width: "20%"}}/>
                    <col/>
                </colgroup>
                <tbody>
                <tr>
                    <td>제목</td>
                    <td>
                        {path ? (
                            data.TITLE
                        ) : (
                            <Form.Control
                                name="title"
                                value={param.title || ""}
                                placeholder="제목을 입력하세요"
                                onChange={(e) => {
                                    changeBoard(e);
                                }}
                            />
                        )}
                    </td>
                </tr>
                <tr>
                    <td>글쓴이</td>
                    <td>{path ? data.AUTHOR : param.author}</td>
                </tr>
                <tr>
                    <td colSpan={2}>
                        {path ? (
                            <Form.Control
                                className="contentsInput disabled"
                                style={{borderStyle: "unset"}}
                                value={data.CONTENTS}
                                as="textarea"
                                disabled
                            />
                        ) : (
                            <Form.Control
                                className="contentsInput"
                                name="contents"
                                value={param.contents || ""}
                                placeholder="내용을 입력하세요."
                                as="textarea"
                                onChange={(e) => {
                                    changeBoard(e);
                                }}
                            />
                        )}
                    </td>
                </tr>
                </tbody>
            </Table>
            {path && (
                <div className="text-center">
                    <img
                        className="thumb_btn"
                        src={thumb}
                        alt="추천"
                        style={{width: "40px", height: "40px"}}
                        onClick={() => {
                            recommend(data.NO);
                        }}
                    />
                    <div>{data.RECOMMEND}</div>
                </div>
            )}
            {path && (
                <div className="my-2">
                    <Comment location={location}/>
                </div>
            )}
            <Link to={"/board"}>
                <button className="common_btn">목록</button>
            </Link>
            {path && (role === "user" || role === "admin") && (
                <div className="user_board_btn">
                    <button
                        className="common_btn"
                        onClick={() => {
                            updateBoard(data.NO);
                        }}
                        disabled={role === "admin"}
                    >
                        수정
                    </button>
                    <button
                        className="common_btn"
                        onClick={() => {
                            deleteBoard(data.NO);
                        }}
                    >
                        삭제
                    </button>
                </div>
            )}
            {!path && (
                <button
                    className="common_btn append"
                    onClick={() => {
                        append_board();
                    }}
                >
                    등록
                </button>
            )}
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
export default BoardDetail;
