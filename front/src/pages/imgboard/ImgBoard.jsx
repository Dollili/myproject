import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {dbGet} from "../../services/commonApi";
import Paging from "../../components/Paging";
import {slugUtil} from "../../utils/common";
import LoadingSpinner from "../../components/LoadingSpinner";

const ImgBoard = () => {
    const [data, setData] = useState([]);
    const [item, setItem] = useState(12); // 한 페이지에 보일 데이터 개수
    const [total, setTotal] = useState(0); // 검색된 총 데이터 수 (전체 포함)
    const [current, setCurrent] = useState(1); // 현재 페이지

    const [isLoading, setLoading] = useState(false);
    const nav = useNavigate();

    const [search, setSearch] = useState({
        option: "",
        val: "",
    });

    const getBoard = async () => {
        search["page"] = current;
        search["size"] = item;
        search["category"] = "img";
        try {
            const res = await dbGet("/board/imgList", search);
            if (res) {
                setTotal(res.total);
                setData(res.data);
            } else {
                setData([]);
            }
            setLoading(true);
        } catch (e) {
            nav("/error", {state: e.status});
        }
    };

    //스크롤 감지
    const [scroll, setScroll] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setScroll(window.scrollY === 0);
        };
        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
    }, [total]);

    useEffect(() => {
        getBoard();
    }, [current, item]);

    return (
        <>
            <div className="main-container">
                <h3 className="boardTitle">🎨 전시회</h3>
                <div className={`search-container ${scroll ? "" : "scroll"}`}>
                    <select
                        className="search-count"
                        name="option"
                        onChange={(e) => {
                            const {value} = e.target;
                            setItem(value);
                        }}
                    >
                        <option value={12}>12건</option>
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
                        <button className="search-button">글쓰기</button>
                    </Link>
                </div>
                {isLoading ? (
                    <div className="grid-container">
                        {data.length === 0 ? (
                            <div className="noPost">게시글이 존재하지 않습니다.</div>
                        ) : (
                            data.map((item, index) => (
                                <div
                                    key={index}
                                    className="card"
                                    onClick={() => {
                                        nav(`/img/${slugUtil(item.TITLE)}`, {state: item.NO});
                                    }}
                                >
                                    <img
                                        src={`${process.env.REACT_APP_API_BASE_URL}${item.IMG_PATH}`}
                                        alt="thumbnail"
                                    />
                                    <div className="info">
                                        <h4>
                                            {item.TITLE}{" "}
                                            <span style={{color: "red", marginLeft: "3px"}}>
                        [{item.COMMENT_CNT}]
                      </span>
                                        </h4>
                                        <p>{item.AUTHOR}</p>
                                        <p>{item.APPLY_FORMAT_DATE}</p>
                                        <p>추천 {item.RECOMMEND}</p>
                                        <p>조회수 {item.VIEW_CNT}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <LoadingSpinner/>
                )}
            </div>
            {isLoading && data.length !== 0 && (
                <Paging total={total} pageItem={item} currentPage={setCurrent}/>
            )}
        </>
    );
};

export default ImgBoard;
