import { Button, Pagination, Table } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Paging from "../../components/Paging";

const Comment = ({ location, getDetail, data }) => {
  const [comment, setComment] = useState({ user: "테스터댓글러" });

  const changeComment = (e) => {
    const { name, value } = e.target;
    setComment({ ...comment, [name]: value });
  };

  const append_comment = async () => {
    comment["no"] = location.state;
    try {
      const res = await axios.post("/api/board/comment", comment, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.data === 1) {
        getDetail();
      }
    } catch {
      alert("등록실패");
    }
  };
  const deleteComment = async (id) => {
    try {
      const res = await axios.delete("/api/board/comment/delete", {
        params: { id: id },
      });
      if (res.data) {
        getDetail();
      }
    } catch {
      alert("삭제실패");
    }
  };
  useEffect(() => {}, [comment]);

  return (
    <>
      <Table bordered>
        <colgroup>
          <col style={{ width: "20%" }} />
          <col style={{ width: "60%" }} />
          <col style={{ width: "20%" }} />
        </colgroup>
        <tbody>
          {data.comment &&
            data.comment.map((com) => (
              <tr>
                <th>{com.USER_NM}</th>
                <td>{com.COMMENT}</td>
                <td>
                  {com.APPLY_FORMAT_DATE}
                  <Button
                    className="btn-danger"
                    onClick={() => {
                      deleteComment(com.ID);
                    }}
                  >
                    삭제
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      <Paging />
      <Table bordered>
        <colgroup>
          <col style={{ width: "20%" }} />
          <col style={{ width: "60%" }} />
          <col style={{ width: "20%" }} />
        </colgroup>
        <tbody>
          <tr>
            <td>사용자이름</td>
            <td>
              <Form.Control
                placeholder="댓글을 입력하세요"
                name="comment"
                as="textarea"
                style={{ height: "100px" }}
                onChange={(e) => {
                  changeComment(e);
                }}
              />
            </td>
            <td>
              <Button
                onClick={() => {
                  append_comment();
                }}
              >
                등록
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  );
};
export default Comment;
