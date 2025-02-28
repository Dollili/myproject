import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { Button, Table } from "react-bootstrap";

const BoardDetail = () => {
  const location = useLocation();
  const [data, setData] = useState({});
  const [path, setPath] = useState(false);

  const [param, setParam] = useState({ author: "하드코딩" });

  const init_data = {
    TITLE: "",
    AUTHOR: "",
    CONTENTS: "",
  };

  const changeObj = (e) => {
    const { name, value } = e.target;
    setParam({ ...param, [name]: value });
  };

  const append_board = async () => {
    const res = await axios.get("/api/board/detail", {
      params: param,
    });
    if (res.data === 1) {
      console.log("ok");
    }
  };

  useEffect(() => {}, [param]);

  useEffect(() => {
    const getDetail = async () => {
      if (location.state) {
        setPath(true);
        const res = await axios.get("/api/board/detail", {
          params: { no: location.state },
        });
        setData(res.data);
      } else {
        setPath(false);
        setData(init_data);
      }
    };
    getDetail().then();
  }, [location.state]);

  return (
    <>
      <div>
        <Table bordered>
          <tbody>
            <tr>
              <td>제목</td>
              <td>
                {path ? (
                  data.TITLE
                ) : (
                  <input
                    name="title"
                    placeholder="제목을 입력하세요"
                    onChange={(e) => {
                      changeObj(e);
                    }}
                  />
                )}
              </td>
            </tr>
            <tr>
              <td>글쓴이</td>
              <td>{path ? data.AUTHOR : param.author}</td>
            </tr>
          </tbody>
        </Table>
        <Table>
          <tr>
            <td>내용</td>
            <td>
              {path ? (
                data.CONTENTS
              ) : (
                <textarea
                  name="contents"
                  placeholder="내용을 입력하세요"
                  onChange={(e) => {
                    changeObj(e);
                  }}
                />
              )}
            </td>
          </tr>
        </Table>
      </div>
      {path && (
        <>
          <div>
            <Button>추천</Button>
          </div>
          <div>
            <h5>댓글</h5>
            <Table bordered>
              <col style={{ width: "20%" }} />
              <col style={{ width: "60%" }} />
              <col style={{ width: "20%" }} />
              <tbody>
                <tr>
                  <th>테스트 댓글러</th>
                  <td>테스트 내용</td>
                  <td>
                    <Button>X</Button>
                  </td>
                </tr>
                <tr>
                  <td>사용자이름</td>
                  <td>
                    <textarea />
                  </td>
                  <td>
                    <Button>등록</Button>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </>
      )}
      <Link to={"/board"}>
        <Button>목록</Button>
      </Link>
      {!path && (
        <Button
          onClick={() => {
            append_board();
          }}
        >
          등록
        </Button>
      )}
    </>
  );
};
export default BoardDetail;
