import React, {useEffect, useState} from "react";
import {ReactSketchCanvas} from "react-sketch-canvas";
import bg from "../assets/img/background.jpg";

const Drawing = ({canvasRef, saveInfo}) => {
    const [eraser, setEraser] = useState(true);
    const [color, setColor] = useState("#000000");
    const [bord, setBorder] = useState("1");
    const disabled = useState("none");

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
        canvasRef.current?.loadPaths(save)
    }

    useEffect(() => {
        if (saveInfo) {
            loadCanvas();
        }
    }, [saveInfo]);

    return (
        <div className="drawing">
            <div className="drawing-contents">
                <ReactSketchCanvas
                    ref={canvasRef}
                    strokeColor={color}
                    backgroundImage={bg}
                    strokeWidth={bord}
                    eraserWidth={bord}
                    exportWithBackgroundImage={false}
                    style={{
                        border: "none",
                    }}
                    withTimestamp={true}
                    allowOnlyPointerType={saveInfo ? disabled : "mouse"}
                />
            </div>
            {!saveInfo && <div className="tools">
                <div>
                    <div>선 굵기 {bord} px</div>
                    <input
                        type="range"
                        min="1"
                        max="30"
                        value={bord}
                        onChange={(e) => {
                            const {value} = e.target;
                            setBorder(value);
                        }}
                    />
                    {/*<button onClick={saveDrawing}>저장</button>*/}
                </div>
                <div>
                    <div>선 색상</div>
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
            </div>}
        </div>
    );
};

export default Drawing;
