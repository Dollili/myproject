import React, {useEffect, useState} from "react";
import {Table} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import {dbGet} from "../../services/commonApi";
import eyeIcon from "../../assets/img/free-icon-eye-4818558.png";
import Paging from "../../components/Paging";
import {slugUtil} from "../../utils/common";

const Board = () => {
    const [data, setData] = useState([]);
    const [item, setItem] = useState(10); // 한 페이지에 보일 데이터 개수
    const [total, setTotal] = useState(0); // 검색된 총 데이터 수 (전체 포함)
    const [current, setCurrent] = useState(1); // 현재 페이지

    const nav = useNavigate();

    const [search, setSearch] = useState({
        option: "",
        val: "",
    });

    const getBoard = async () => {
        search["page"] = current;
        search["size"] = item;
        search["category"] = 'board';
        try {
            const res = await dbGet("/board/list", search);
            if (res) {
                setTotal(res.total);
                setData(res.data);
            } else {
                setData([]);
            }
        } catch (e) {
            nav("/error", {state: e.status});
        }
    };

    useEffect(() => {
    }, [total]);

    useEffect(() => {
        getBoard();
    }, [current, item]);

    return (
        <>
            <div className="main-container notice">
                <div className="search-container notice-search">
                    <select
                        className="search-count notice-count"
                        name="option"
                        onChange={(e) => {
                            const {value} = e.target;
                            setItem(value);
                        }}
                    >
                        <option value={10}>10건</option>
                        <option value={15}>15건</option>
                        <option value={30}>30건</option>
                    </select>
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
                    <Link to={"detail"}>
                        <button className="search-button" style={{float: "right"}}>
                            글쓰기
                        </button>
                    </Link>
                </div>
                <Table bordered hover className="board my-2">
                    <colgroup>
                        <col style={{width: "5%"}}/>
                        <col style={{width: "55%"}}/>
                        <col style={{width: "15%"}}/>
                        <col style={{width: "15%"}}/>
                        <col style={{width: "5%"}}/>
                        <col style={{width: "5%"}}/>
                    </colgroup>
                    <thead>
                    <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>날짜</th>
                        <th>추천수</th>
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
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={6}>게시글이 존재하지 않습니다.</td>
                        </tr>
                    ) : (
                        data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.ROWNUM}</td>
                                <td
                                    className="contents-td"
                                    onClick={() => {
                                        nav(`/board/${slugUtil(item.TITLE)}`, {state: item.NO});
                                    }}
                                >
                                    {item.TITLE}
                                    <span style={{color: "red", marginLeft: "3px"}}>[{item.COMMENT_CNT}]</span>
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
            </div>
            {data.length !== 0 && (
                <Paging total={total} pageItem={item} currentPage={setCurrent}/>
            )}
        </>
    );
};

export default Board;
