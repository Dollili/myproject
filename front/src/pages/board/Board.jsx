import React, {useEffect, useState} from "react";
import {Container, Table} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import {dbGet} from "../../assets/api/commonApi";
import eyeIcon from "../../assets/img/free-icon-eye-4818558.png";
import Paging from "../../components/Paging";

const Board = () => {
    const [data, setData] = useState([]);
    const [cnt, setCnt] = useState(0);
    const nav = useNavigate();

    const [search, setSearch] = useState({
        option: "",
        val: "",
    });

    const getBoard = async () => {
        try {
            const res = await dbGet("/board/list", search);
            if (res) {
                setCnt(res.length);
                setData(res);
            }
        } catch (e) {
            nav("/error");
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
                    <button
                        className="search-button"
                        onClick={() => {
                            getBoard().then(() => setSearch({...search, val: ""}));
                        }}
                    >
                        검색
                    </button>
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
                        <th>
                            <img
                                src={eyeIcon}
                                alt="조회수"
                                style={{width: "20px", height: "20px"}}
                            />
                        </th>
                    </tr>
                    </thead>

                    <tbody>
                    {data == null ? (
                        <tr>
                            <td colSpan={6}>게시글이 존재하지 않습니다.</td>
                        </tr>
                    ) : (
                        data.map((item, index) => (
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
                        ))
                    )}
                    </tbody>
                </Table>
            </Container>
            <Paging cnt={cnt}/>
            <Container>
                <Link to={"detail"}>
                    <button className="common_btn" style={{float: "right"}}>
                        글쓰기
                    </button>
                </Link>
            </Container>
        </div>
    );
};

export default Board;
