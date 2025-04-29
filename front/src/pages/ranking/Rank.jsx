import React, {useState} from "react";

const Rank = () => {
    const [data, setData] = useState([]);

    return (
        <div className="main-container">
            <h2 className="boardTitle">명예의 전당</h2>
            <div className="grid-container">
                {data.length === 0 ? (
                    <div className="noPost">RANKING 데이터가 존재하지 않습니다.</div>
                ) : (
                    data.map((item, index) => (
                        <div
                            key={index}
                            className="card"
                            onClick={() => {
                            }}
                        >
                            <img src={`${process.env.REACT_APP_BACKEND_URL}${item.IMG_PATH}`} alt="thumbnail"/>
                            <div className="info">
                                <h4>{item.TITLE} <span
                                    style={{color: "red", marginLeft: "3px"}}>[{item.COMMENT_CNT}]</span></h4>
                                <p>{item.AUTHOR}</p>
                                <p>{item.APPLY_FORMAT_DATE}</p>
                                <p>추천 {item.RECOMMEND}</p>
                                <p>조회수 {item.VIEW_CNT}</p>
                            </div>
                            {" "}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Rank;
