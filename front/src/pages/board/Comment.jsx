import {Table} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import React, {useContext, useEffect, useRef, useState} from "react";
import Paging from "../../components/Paging";
import {dbGet, dbPost, dbPut} from "../../assets/api/commonApi";
import {UserContext} from "../../components/UserContext";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import del_icon from "../../assets/img/free-icon-remove-1828843.png";

const Comment = ({location}) => {
    const {user} = useContext(UserContext);
    const nav = useNavigate();
    const textareaRef = useRef();

    const [item, setItem] = useState(5);
    const [current, setCurrent] = useState(1);

    const [cmt, setCmt] = useState([]);

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
        if (comment?.comment == null || comment?.comment.length === 0)
            return toast.info("내용을 입력해주세요.");
        comment["no"] = location.state;
        try {
            const res = await dbPost("/board/comment", comment);
            if (res === 1) {
                getComment();
                console.log(comment)
                textareaRef.current.value = "";
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

    useEffect(() => {
        getComment();
    }, [current]);

    return (
        <div className="my-2">
            <h5>댓글</h5>
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
export default Comment;
