import React, {useEffect, useState} from "react";
import medal2 from "../../assets/img/free-icon-medal-2583319.png";
import medal3 from "../../assets/img/free-icon-medal-2583434.png";
import medal1 from "../../assets/img/free-icon-medal-2583344.png";
import noImg from "../../assets/img/free-icon-broken-image-13435075.png";

import {dbGet} from "../../services/commonApi";

const Rank = () => {
    const [data1, setData1] = useState({});
    const [data2, setData2] = useState({});
    const [data3, setData3] = useState({});
    const [load, setLoad] = useState(false);

    const getRanking = async () => {
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
    };

    useEffect(() => {
        getRanking();
    }, []);

    return (
        <div className="main-container ranking-container">
            <h2 className="boardTitle">명예의 전당</h2>
            <div className="grid-container ranking">
                {load ? (
                    <div className="noPost">RANKING 데이터가 존재하지 않습니다.</div>
                ) : (
                    <>
                        {/*<div className="left">왼쪽</div>*/}
                        <div className="rank rank-2">
                            <img className="crown" src={medal2} alt="crown"/>
                            <div className="card rank2">
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
                        <div className="rank rank-1">
                            <img className="crown" src={medal1} alt="crown"/>
                            <div className="card rank1">
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
                            <div className="card rank3">
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
