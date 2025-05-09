import React, {useContext, useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import Form from "react-bootstrap/Form";
import {Table} from "react-bootstrap";
import {dbForm, dbGet, dbPost, dbPut} from "../../services/commonApi";
import {UserContext} from "../../contexts/UserContext";
import {toast} from "react-toastify";
import FileUpload from "../../components/FileUpload";
import axios from "axios";
import del_icon from "../../assets/img/free-icon-remove-1828843.png";
import BoardComment from "./BoardComment";
import MyEditor from "../../components/MyEditor";
import DOMPurity from "quill/formats/link";
import thumb from "../../assets/img/thumbs_16019896.png";
import ToastCon from "../../components/ToastCon";

const BoardDetail = () => {
    const nav = useNavigate();
    const {user, setUser} = useContext(UserContext);

    const [role, setRole] = useState(false);

    const location = useLocation();
    const [data, setData] = useState({});
    const [files, setFiles] = useState([]);
    const [trash, setTrash] = useState([]);

    const [path, setPath] = useState(false);
    const [param, setParam] = useState({author: user.USER_NIC});

    const changeBoard = (e) => {
        const {name, value} = e.target;
        setParam({...param, [name]: value});
    };

    const changeContent = (val) => {
        setParam({...param, contents: val});
    };

    const downloadFile = async (file, origin) => {
        try {
            const response = await axios.get(
                process.env.REACT_APP_API_BASE_URL + "/files/" + file,
                {
                    responseType: "blob",
                    withCredentials: true,
                },
            );
            const blob = new Blob([response.data]);
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = origin;
            link.click();
        } catch (error) {
            toast.error(error);
        }
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
            let file_res;

            if (Object.keys(data).length > 0) {
                if (trash?.length > 0) {
                    const res = await fileDel();
                    if (!res) return;
                }
                res = await dbPut("/board/detail/modify", param);
            } else {
                param["category"] = "board";
                res = await dbPost("/board/detail", param);
            }

            if (files?.length > 0) {
                if (data) {
                    await dbForm(files, data.no);
                } else {
                    await dbForm(files);
                }
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
            return toast.warn("본인이 작성한 글에는 추천할 수 없습니다.");
        }

        try {
            const res = await dbPut("/board/detail/recommend", {no: no});
            if (res === 200) {
                getDetail();
            }
        } catch (e) {
            if (e.status === 515) {
                return toast.warn("이미 추천한 게시물 입니다.");
            }
            nav("/error", {state: e.status});
        }
    };

    const fileDel = async () => {
        if (trash?.length > 0) {
            try {
                return await dbPut("/file/delete", trash);
            } catch (e) {
                toast.error("파일 삭제 Fail", {
                    onClose: () => nav("/error", {state: e.status}),
                });
            }
        } else {
            return true;
        }
    };

    const filterFile = (id) => {
        setData((prev) => ({
            ...prev,
            file: prev.file.filter((item) => item.ID !== id),
        }));
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
                    <td>첨부파일</td>
                    <td>
                        {data &&
                            data.file?.length > 0 &&
                            data.file.map((f, idx) => (
                                <div className="file-div" key={idx}>
                    <span
                        className="file-view"
                        onClick={() => {
                            downloadFile(f.FILE_NM, f.ORIGIN_NM);
                        }}
                    >
                      {f.ORIGIN_NM}
                    </span>
                                    {!path && (
                                        <img
                                            key={idx}
                                            className="comment_del file"
                                            src={del_icon}
                                            alt="파일삭제"
                                            onClick={() => {
                                                setTrash((prev) => [...prev, f.ID]);
                                                filterFile(f.ID);
                                            }}
                                        />
                                    )}
                                    <br/>
                                </div>
                            ))}
                        <FileUpload
                            files={files}
                            setFiles={setFiles}
                            data={data}
                            onOff={path}
                        />
                    </td>
                </tr>
                <tr>
                    <td colSpan={2}>
                        {path ? (
                            <div
                                className="contentsInput"
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurity.sanitize(data.CONTENTS),
                                }}
                                style={{borderStyle: "unset", fontFamily: "initial"}}
                            />
                        ) : (
                            <MyEditor
                                onChange={changeContent}
                                value={param.contents || ""}
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
                    <BoardComment location={location}/>
                </div>
            )}
            <Link to={"/board"}>
                <button className="common_btn">목록</button>
            </Link>
            {path && role && (
                <div className="user_board_btn">
                    <button
                        className="common_btn"
                        onClick={() => {
                            updateBoard(data.NO);
                        }}
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
            <ToastCon autoClose={2000}/>
        </div>
    );
};
export default BoardDetail;
