import {Table} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import React, {useContext, useEffect, useRef, useState} from "react";
import Paging from "../../components/Paging";
import {dbGet, dbPost, dbPut} from "../../services/commonApi";
import {UserContext} from "../../contexts/UserContext";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import del_icon from "../../assets/img/free-icon-remove-1828843.png";

const NoticeComment = ({location}) => {
    const {user} = useContext(UserContext);
    const nav = useNavigate();
    const textareaRef = useRef();

    const [time, setTime] = useState("desc");

    const [item, setItem] = useState(10);
    const [current, setCurrent] = useState(1);

    const [cmt, setCmt] = useState([]);

    const [submit, setSubmit] = useState(false);
    const [comment, setComment] = useState(() => {
        return user.ROLE === "M" ? {nic: "관리자"} : {nic: user.USER_NIC};
    });

    const changeComment = (e) => {
        const {name, value} = e.target;
        setComment({...comment, [name]: value});
    };

    const getComment = async () => {
        const param = {};
        param["no"] = location.state;
        param["page"] = current;
        param["size"] = item;
        param["orderBy"] = time;
        try {
            const res = await dbGet("/board/comment", param);
            if (res) {
                setCmt(res);
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
    };

    const append_comment = async () => {
        if (submit) {
            return toast.info("잠시 후에 다시 시도해주세요.");
        }
        if (comment?.comment == null || comment?.comment.length === 0)
            return toast.info("내용을 입력해주세요.");
        comment["no"] = location.state;
        try {
            comment["category"] = "notice";

            const res = await dbPost("/board/comment", comment);
            if (res === 1) {
                setComment(prev => ({...prev, "comment": ""}))
                textareaRef.current.value = "";
                getComment();
                setSubmit(true);
                setTimeout(() => {
                    setSubmit(false);
                }, 3000);
            }
        } catch (e) {
            nav("/error", {state: e.status});
        }
    };

    const deleteComment = async (id) => {
        try {
            const res = await dbPut("/board/comment/delete", {id: id});
            if (res === 200) {
                getComment();
            }
        } catch (e) {
            if (e.status === 409) {
                return toast.warn("삭제 권한이 없습니다.");
            }
            nav("/error", {state: e.status});
        }
    };

    const timeList = () => {
        if (time === "desc") {
            setTime("asc");
        } else {
            setTime("desc");
        }
    };

    useEffect(() => {
        getComment(time);
    }, [current, time]);

    return (
        <div className="my-2">
            <div className="commentHead">
                <div>
                    <h5>댓글</h5>
                </div>
                <div className="timeList">
          <span
              className={`time ${time === 'desc' ? 'desc' : ''}`}
              onClick={() => {
                  timeList();
              }}
          >
            최신순
          </span>
                    <span> | </span>
                    <span
                        className={`time ${time === 'asc' ? 'asc' : ''}`}
                        onClick={() => {
                            timeList();
                        }}
                    >
             과거순
          </span>
                </div>
            </div>
            <div className="comment">
                <Table bordered>
                    <colgroup>
                        <col style={{width: "20%"}}/>
                        <col style={{width: "60%"}}/>
                        <col style={{width: "20%"}}/>
                    </colgroup>
                    <tbody>
                    {cmt &&
                        cmt.map((com, index) => (
                            <tr key={index}>
                                <td>{com.USER_NIC}</td>
                                <td>{com.COMMENT}</td>
                                <td>
                                    {com.APPLY_FORMAT_DATE}
                                    <img
                                        className="comment_del"
                                        src={del_icon}
                                        alt="삭제"
                                        onClick={() => {
                                            deleteComment(com.ID);
                                        }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                {cmt[0] && (
                    <Paging
                        total={cmt[0].TOTAL}
                        pageItem={item}
                        currentPage={setCurrent}
                    />
                )}
                <Table bordered>
                    <colgroup>
                        <col style={{width: "20%"}}/>
                        <col style={{width: "60%"}}/>
                        <col style={{width: "20%"}}/>
                    </colgroup>
                    <tbody>
                    <tr>
                        <td>{comment.nic}</td>
                        <td>
                            <Form.Control
                                className="areaInput"
                                ref={textareaRef}
                                placeholder="댓글을 입력하세요"
                                name="comment"
                                as="textarea"
                                onChange={(e) => {
                                    changeComment(e);
                                }}
                            />
                        </td>
                        <td className="td3">
                            <button
                                className="common_btn comment"
                                onClick={() => {
                                    append_comment();
                                }}
                            >
                                등록
                            </button>
                        </td>
                    </tr>
                    </tbody>
                </Table>
            </div>
        </div>
    );
};
export default NoticeComment;
