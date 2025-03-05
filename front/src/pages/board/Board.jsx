import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Container, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const Board = () => {
  const [data, setData] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    const getBoard = async () => {
      const res = await axios.get("api/board");
      console.log("응답: ", res.data);
      setData(res.data);
    };
    getBoard().then();
  }, []);

  return (
    <>
      <Container id="container">
        <div className="search-container my-2">
          <select className="search-select">
            <option>전체</option>
            <option>작성자</option>
            <option>제목</option>
          </select>
          <input className="search-input" type="text"/>
          <Button className="search-button">검색</Button>
        </div>
        <Table striped bordered hover className="my-4">
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>날짜</th>
              <th>추천</th>
              <th>조회</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.NO}</td>
                <td
                  onClick={() => {
                    nav(`/board/${item.NO}`, { state: item.NO });
                  }}
                >
                  {item.TITLE}
                </td>
                <td>{item.AUTHOR}</td>
                <td>{item.APPLY_FORMAT_DATE}</td>
                <td>{item.RECOMMEND}</td>
                <td>{item.VIEW_CNT}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
      <Container>
        <Link to={"detail"}>
          <Button>글 작성</Button>
        </Link>
      </Container>
    </>
  );
};

export default Board;
