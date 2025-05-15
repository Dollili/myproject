import React, {useEffect, useState} from "react";
import {ReactSketchCanvas} from "react-sketch-canvas";

const Drawing = ({canvasRef, saveInfo, drawTime}) => {
    const [eraser, setEraser] = useState(true);
    const [color, setColor] = useState("#000000");
    const [bord, setBorder] = useState("1");

    const undo = () => {
        canvasRef.current?.undo();
    };

    const redo = () => {
        canvasRef.current?.redo();
    };

    const clearCanvas = () => {
        canvasRef.current?.clearCanvas();
    };

    const loadCanvas = () => {
        const save = JSON.parse(saveInfo);
        canvasRef.current?.loadPaths(save);
    };

    useEffect(() => {
        if (saveInfo) {
            loadCanvas();
        }
    }, [saveInfo]);

    return (
        <div className="drawing">
            <div className="drawing-contents">
                <ReactSketchCanvas
                    className="sketchCanvas"
                    ref={canvasRef}
                    strokeColor={color}
                    strokeWidth={bord}
                    eraserWidth={bord}
                    exportWithBackgroundImage={false}
                    style={{
                        border: "none",
                        cursor: saveInfo ? "default" : "crosshair",
                    }}
                    withTimestamp={true}
                    allowOnlyPointerType={saveInfo ? "none" : "mouse"}
                />
            </div>
            {!saveInfo && (
                <div className="tools">
                    <div>
                        <div>선 굵기 {bord} px</div>
                        <br/>
                        <input
                            className="custom-range"
                            type="range"
                            min="1"
                            max="30"
                            value={bord}
                            onChange={(e) => {
                                const {value} = e.target;
                                setBorder(value);
                            }}
                        />
                    </div>
                    <div>
                        <div>색상</div>
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                        />
                    </div>
                    <div className="common_btn" onClick={undo}>
                        뒤로 ↺
                    </div>
                    <div className="common_btn" onClick={redo}>
                        앞으로 ↻
                    </div>
                    <div
                        className="common_btn"
                        onClick={() => {
                            setEraser(!eraser);
                            canvasRef.current?.eraseMode(eraser);
                        }}
                    >
                        {!eraser ? "펜 ✏️" : "지우개 ✐"}
                    </div>
                    <br/>
                    <div className="common_btn" onClick={clearCanvas}>
                        전체 비우기🗑️
                    </div>
                </div>
            )}
            {saveInfo && (
                <div className="tools result">
                    <div>
                        ✏️ 총 소요시간:{" "}
                        {Math.floor(drawTime / 1000 / 60) +
                            " 분 " +
                            Math.floor((drawTime / 1000) % 60) +
                            " 초"}
                    </div>
                    <p>(펜의 움직임 시간을 기준으로 합니다)</p>
                </div>
            )}
        </div>
    );
};

export default Drawing;
