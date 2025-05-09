import React, {useContext, useEffect, useRef, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import Form from "react-bootstrap/Form";
import {Table} from "react-bootstrap";
import ImgComment from "./ImgComment";
import {dbForm, dbGet, dbPost, dbPut} from "../../services/commonApi";
import {UserContext} from "../../contexts/UserContext";
import {toast} from "react-toastify";
import thumb from "../../assets/img/thumbs_16019896.png";
import axios from "axios";
import del_icon from "../../assets/img/free-icon-remove-1828843.png";
import Drawing from "../../components/Drawing";
import api from "../../services/axiosInterceptor";
import FileUpload from "../../components/FileUpload";
import ToastCon from "../../components/ToastCon";

const ImgBoardDetail = () => {
    const nav = useNavigate();
    const {user, setUser} = useContext(UserContext);

    const [role, setRole] = useState("");

    const location = useLocation();
    const [data, setData] = useState({});
    const [files, setFiles] = useState([]);
    const [trash, setTrash] = useState([]);
    const click = useRef(null);

    const [path, setPath] = useState(false);
    const [param, setParam] = useState({author: user.USER_NIC});

    const canvasRef = useRef(null);

    const changeBoard = (e) => {
        const {name, value} = e.target;
        setParam({...param, [name]: value});
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
                const res = await dbGet("/board/imgDetail", {no: location.state});
                if (res) {
                    setData(res);
                } else {
                    toast.error("조회 오류 발생", {
                        onClose: () => {
                            nav("/img");
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
            !["title", "drawinfo"].every((key) => param[key] && param[key].length > 0)
        ) {
            return true;
        }
    };

    const append_board = async (temp) => {
        try {
            const imgInfo = await canvasRef.current?.exportPaths();
            const time = await canvasRef.current?.getSketchingTime();

            param["drawinfo"] = JSON.stringify(imgInfo);
            param["drawtime"] = time;

            if (validation(param) && !temp) {
                return toast.info("제목과 내용을 모두 입력해주세요.");
            }
            temp === "temp" ? (param["temp"] = "T") : (param["temp"] = null);

            let res;
            let imgPath;

            const img = await canvasRef.current?.exportImage("png");
            const formData = new FormData();
            formData.append("file", base64ToBlob(img), "drawing");
            if (data?.IMG_NM) {
                formData.append("name", data.IMG_NM);
            }
            imgPath = await api.post("/file/upload/temp", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (imgPath.data?.url) {
                param["imgpath"] = imgPath.data.url;
                param["imgname"] = imgPath.data.name;
            }

            if (Object.keys(data).length > 0) {
                const del = await fileDel();
                if (!del) return;
                res = await dbPut("/board/imgDetail/modify", param);
            } else {
                param["category"] = "img";
                res = await dbPost("/board/imgDetail", param);
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
                        nav("/img");
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
            drawinfo: data.DRAWINFO,
            drawtime: data.DRAWTIME,
            author: data.AUTHOR,
            imgpath: data.IMG_PATH,
            no: no,
        };
        setParam({...param, ...meta});
        setPath(false);
    };

    const deleteBoard = async (no) => {
        let qa = window.confirm("해당 게시물을 삭제하시겠습니까?");
        if (qa) {
            try {
                const res = await dbPut("/board/imgDetail", {no});
                if (res === 204) {
                    toast.success("삭제완료", {
                        autoClose: 500,
                        onClose: () => {
                            nav("/img");
                        },
                    });
                } else {
                    toast.error("삭제실패");
                }
            } catch (e) {
                nav("/error", {state: e.status});
            }
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

    const recommend = async (no) => {
        if (role === "user") {
            return toast.warn("본인이 작성한 글에는 추천할 수 없습니다.");
        }

        try {
            const res = await dbPut("/board/imgDetail/recommend", {no: no});
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

    const base64ToBlob = (img) => {
        const file = atob(img.split(",")[1]);
        const arrays = [];
        for (let i = 0; i < file.length; i++) {
            arrays.push(file.charCodeAt(i));
        }
        return new Blob([new Uint8Array(arrays)], {type: "image/png"});
    };

    const userCheck = () => {
        if (user.USER_NIC === data.AUTHOR) {
            setRole("user");
        } else if (user.ROLE === "M") {
            setRole("admin");
        }
    };

    /*useEffect(() => {
                    if (files?.length > 0) {
                        files.forEach(function (f) {
                            if (!f.type.startsWith("image/")) {
                                toast.info("이미지 파일만 업로드 가능합니다.", {
                                    autoClose: 500,
                                });
                                setFiles(null);
                                click.current.value = null;
                            }
                        });
                    }
                }, [files]);*/

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
                    <td className="contents-section" colSpan={2}>
                        {path ? (
                            <Drawing
                                canvasRef={canvasRef}
                                saveInfo={data?.DRAWINFO}
                                drawTime={data?.DRAWTIME}
                            />
                        ) : (
                            <Drawing canvasRef={canvasRef}/>
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
            {path && data.DEL_YN !== "T" && (
                <div className="my-2">
                    <ImgComment location={location}/>
                </div>
            )}
            <Link to={"/img"}>
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
                        hidden={role === "admin"}
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
                <>
                    <button
                        className="common_btn temp"
                        onClick={() => {
                            append_board("temp");
                        }}
                    >
                        임시 저장
                    </button>
                    <button
                        className="common_btn append"
                        onClick={() => {
                            append_board();
                        }}
                    >
                        등록
                    </button>
                </>
            )}
            <ToastCon autoClose={2000}/>
        </div>
    );
};
export default ImgBoardDetail;
