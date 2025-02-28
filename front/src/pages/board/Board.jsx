import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const Board = () => {
  const [data, setData] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    const getBoard = async () => {
      const res = await axios.get("api/board");
      console.log("응답: ", res.data)
      setData(res.data);
    };
    getBoard().then();
  }, []);

  return (
    <>
      <Table striped bordered hover>
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
              <td>{item.VEIW_CNT}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Link to={"/"}>
        <Button>home</Button>
      </Link>
      <Link to={"detail"}>
        <Button>등록</Button>
      </Link>
    </>
  );
};

export default Board;
