import React, {useEffect, useState} from "react";
import {Button, Container, Table} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import {dbGet} from "../../assets/api/commonApi";

const Board = () => {
    const [data, setData] = useState([]);
    const nav = useNavigate();

    const [search, setSearch] = useState({
        option: "",
        val: "",
    });

    const getBoard = async () => {
        const res = await dbGet("/board/list", search);
        if (res) {
            setData(res);
        }
    };

    useEffect(() => {
    }, [search]);

    useEffect(() => {
        getBoard();
    }, []);

    return (
        <div className="main-container">
            <Container>
                <div className="search-container">
                    <select
                        className="search-select"
                        name="option"
                        onChange={(e) => {
                            const {name, value} = e.target;
                            setSearch({...search, [name]: value});
                        }}
                    >
                        <option value="">전체</option>
                        <option value="author">작성자</option>
                        <option value="title">제목</option>
                    </select>
                    <input
                        className="search-input"
                        name="val"
                        value={search.val}
                        type="text"
                        onChange={(e) => {
                            const {name, value} = e.target;
                            setSearch({...search, [name]: value});
                        }}
                    />
                    <Button
                        className="search-button"
                        onClick={() => {
                            getBoard().then(() => setSearch({...search, val: ""}));
                        }}
                    >
                        검색
                    </Button>
                </div>
                <Table striped bordered hover className="board my-2">
                    <colgroup>
                        <col style={{width: "10%"}}/>
                        <col style={{width: "40%"}}/>
                        <col style={{width: "15%"}}/>
                        <col style={{width: "15%"}}/>
                        <col style={{width: "10%"}}/>
                        <col style={{width: "10%"}}/>
                    </colgroup>
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
                                    nav(`/board/${item.NO}`, {state: item.NO});
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
                    <Button style={{float: "right"}}>글쓰기</Button>
                </Link>
            </Container>
        </div>
    );
};

export default Board;
