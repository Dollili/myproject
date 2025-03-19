import {Table} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import React, {useContext, useEffect, useRef, useState} from "react";
import Paging from "../../components/Paging";
import {dbPost, dbPut} from "../../assets/api/commonApi";
import {UserContext} from "../../components/UserContext";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import del_icon from "../../assets/img/free-icon-remove-1828843.png";

const Comment = ({location, getDetail, data}) => {
    const {user} = useContext(UserContext);
    const nav = useNavigate();
    const textareaRef = useRef();

    const [comment, setComment] = useState(() => {
        return user.ROLE === "M" ? {user: "관리자"} : {user: user.USER_ID};
    });

    const changeComment = (e) => {
        const {name, value} = e.target;
        setComment({...comment, [name]: value});
    };

    const append_comment = async () => {
        if (comment?.comment == null || comment?.comment.length === 0) return toast.info("내용을 입력해주세요.");
        comment["no"] = location.state;
        try {
            const res = await dbPost("/board/comment", comment);
            if (res === 1) {
                getDetail();
                textareaRef.current.value = '';
            } else {
                toast.error("등록실패");
            }
        } catch (e) {
            nav("/error", {state: e.status});
        }
    };

    const deleteComment = async (id) => {
        try {
            const res = await dbPut("/board/comment/delete", {id: id});
            if (res === 204) {
                getDetail();
            } else {
                toast.error("삭제실패");
            }
        } catch (e) {
            nav("/error", {state: e.status});
        }
    };

    useEffect(() => {
    }, [comment]);

    return (
        <div className="comment">
            <Table bordered>
                <colgroup>
                    <col style={{width: "20%"}}/>
                    <col style={{width: "60%"}}/>
                    <col style={{width: "20%"}}/>
                </colgroup>
                <tbody>
                {data.comment &&
                    data.comment.map((com, index) => (
                        <tr key={index}>
                            <td>{com.USER_NM}</td>
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
            {data.comment && data.comment.length > 0 && <Paging/>}
            <Table bordered>
                <colgroup>
                    <col style={{width: "20%"}}/>
                    <col style={{width: "60%"}}/>
                    <col style={{width: "20%"}}/>
                </colgroup>
                <tbody>
                <tr>
                    <td>{comment.user}</td>
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
    );
};
export default Comment;
