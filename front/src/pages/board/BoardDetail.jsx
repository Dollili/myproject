import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Form from "react-bootstrap/Form";
import { Button, Container, ListGroup, Table } from "react-bootstrap";
import customAlert from "../../components/customAlert";
import Comment from "./Comment";

const BoardDetail = () => {
  const nav = useNavigate();
  const location = useLocation();
  const [data, setData] = useState({});
  const init_data = {
    TITLE: "",
    AUTHOR: "",
    CONTENTS: "",
  };

  const [path, setPath] = useState(false);
  //게시글
  const [param, setParam] = useState({ author: "하드코딩" });

  const [cnt, setCnt] = useState(0);

  const changeBoard = (e) => {
    const { name, value } = e.target;
    setParam({ ...param, [name]: value });
  };

  const getDetail = async () => {
    if (location.state) {
      setPath(true);
      try {
        const res = await axios.get("/api/board/detail", {
          params: { no: location.state },
        });
        setData(res.data);
      } catch {
        customAlert("조회 오류 발생", () => {
          nav("board");
        });
      }
    } else {
      setPath(false);
      setData(init_data);
    }
  };

  const append_board = async () => {
    try {
      const res = await axios.post("/api/board/detail", param, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.data === 1) {
        customAlert("등록완료", () => {
          nav("board");
        });
      }
    } catch {
      alert("등록실패");
    }
  };

  const recommend = async (no) => {
    try {
      const res = await axios.put("/api/board/detail/recommend", { no: no });
      if (res) {
        getDetail();
      }
    } catch {
      alert("추천실패");
    }
  };
  useEffect(() => {}, [cnt]);

  const commonProps = {
    location,
    getDetail,
    data,
  };

  useEffect(() => {}, [param]);

  useEffect(() => {
    getDetail();
  }, []);

  return (
    <>
      <Container>
        <Table bordered>
          <colgroup>
            <col style={{ width: "20%" }} />
            <col />
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
              <td></td>
              <td>
                {path ? (
                  <Form.Control
                    className="contentsInput disabled"
                    value={data.CONTENTS}
                    as="textarea"
                    disabled
                  />
                ) : (
                  <Form.Control
                    className="contentsInput"
                    name="contents"
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
          <Container className="text-center">
            <Button
              onClick={() => {
                recommend(data.NO);
              }}
            >
              추천 {data.RECOMMEND}
            </Button>
          </Container>
        )}
        {path && (
          <ListGroup className="my-2">
            <h5>댓글</h5>
            <Comment {...commonProps} />
          </ListGroup>
        )}
        <Link to={"/board"}>
          <Button>목록</Button>
        </Link>
        {path && <Button variant="danger">글 삭제</Button>}
        {!path && (
          <Button
            onClick={() => {
              append_board();
            }}
          >
            등록
          </Button>
        )}
      </Container>
    </>
  );
};
export default BoardDetail;
