import React, {useEffect, useState} from "react";
import medal2 from "../../assets/img/free-icon-medal-2583319.png";
import medal3 from "../../assets/img/free-icon-medal-2583434.png";
import medal1 from "../../assets/img/free-icon-medal-2583344.png";
import noImg from "../../assets/img/free-icon-broken-image-13435075.png";

import {dbGet} from "../../services/commonApi";
import {useNavigate} from "react-router-dom";
import {slugUtil} from "../../utils/common";

const Rank = () => {
    const nav = useNavigate();

    const [data1, setData1] = useState({});
    const [data2, setData2] = useState({});
    const [data3, setData3] = useState({});
    const [load, setLoad] = useState(false);

    const [effect, setEffect] = useState("");

    const getRanking = async () => {
        try {
            const res = await dbGet("/board/imgList/rank", {});
            if (res.length === 0) {
                setLoad(true);
                return;
            }
            if (res[0]?.IMG_PATH) {
                setData1(res[0]);
            }
            if (res[1]?.IMG_PATH) {
                setData2(res[1]);
            }
            if (res[2]?.IMG_PATH) {
                setData3(res[2]);
            }
        } catch (e) {
            nav("/error", {state: e.status})
        }
    };

    const movePage = (title, no) => {
        nav("/img/" + slugUtil(title), {state: no})
    }

    useEffect(() => {
        getRanking().then(() => {
            setTimeout(() => {
                setEffect("effect")
                setTimeout(() => {
                    setEffect("")
                }, 3000)
            }, 1000);
        });
    }, []);

    return (
        <div className="main-container ranking-container">
            <h2 className="boardTitle">
                <p>🖼️ 명예의 전당</p>
            </h2>
            <div className="titleWrapper">
                <h3 className="ranking-title origin">
                    <span>✨ 1위 {data1.AUTHOR} 님</span>
                    <span>2위 {data2.AUTHOR} 님</span>
                    <span>3위 {data3.AUTHOR} 님</span>
                    <span>축하드립니다 ✨</span>
                </h3>
            </div>
            <div className="grid-container ranking">
                {load ? (
                    <div className="noPost">RANKING 데이터가 존재하지 않습니다.</div>
                ) : (
                    <>
                        {/*<div className="left">왼쪽</div>*/}
                        <div className="rank rank-2">
                            <img className="crown" src={medal2} alt="crown"/>
                            <div className="card rank2" onClick={() => movePage(data2.TITLE, data2.NO)}>
                                <img
                                    className={!data2.IMG_PATH ? "noImg" : ""}
                                    src={
                                        data2.IMG_PATH
                                            ? `${process.env.REACT_APP_BACKEND_URL}${data2.IMG_PATH}`
                                            : noImg
                                    }
                                    alt="thumbnail"
                                />
                                <div hidden={data2.IMG_PATH}>Image not found . . .</div>
                            </div>
                        </div>
                        <div className={`rank rank-1 ${effect}`}>
                            <img className="crown" src={medal1} alt="crown"/>
                            <div className="card rank1" onClick={() => movePage(data1.TITLE, data1.NO)}>
                                <img
                                    className={!data1.IMG_PATH ? "noImg" : ""}
                                    src={
                                        data1.IMG_PATH
                                            ? `${process.env.REACT_APP_BACKEND_URL}${data1.IMG_PATH}`
                                            : noImg
                                    }
                                    alt="thumbnail"
                                />
                                <div hidden={data1.IMG_PATH}>Image not found . . .</div>
                            </div>
                        </div>
                        <div className="rank rank-3">
                            <img className="crown" src={medal3} alt="crown"/>
                            <div className="card rank3" onClick={() => movePage(data3.TITLE, data3.NO)}>
                                <img
                                    className={!data3.IMG_PATH ? "noImg" : ""}
                                    src={
                                        data3.IMG_PATH
                                            ? `${process.env.REACT_APP_BACKEND_URL}${data3.IMG_PATH}`
                                            : noImg
                                    }
                                    alt="thumbnail"
                                />
                                <div hidden={data3.IMG_PATH}>Image not found . . .</div>
                            </div>
                        </div>
                        {/*<div className="right">오른쪽</div>*/}
                    </>
                )}
            </div>
        </div>
    );
};

export default Rank;
