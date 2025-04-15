import React, {useRef, useState} from "react";
import {ReactSketchCanvas} from "react-sketch-canvas";
import bg from "../assets/img/background.jpg"

const Drawing = ({onSave}) => {
    const canvasRef = useRef(null);
    const [eraser, setEraser] = useState(true);
    const [color, setColor] = useState("#000000");
    const [bord, setBorder] = useState("1");

    const [result, setResult] = useState({
        img: "",
        data: "",
        time: "",
    })

    const save = async () => {
        const img = await canvasRef.current?.exportImage("png");
        const data = await canvasRef.current?.exportPaths();
        const time = await canvasRef.current?.getSketchingTime();

        const formData = new FormData();
        formData.append("img", base64ToBlob(img));
        formData.append("paths", JSON.stringify(data));
        formData.append("time", JSON.stringify(time));
        console.log(formData.get("paths"));


        console.log('총 시간 (그린 시간 기준 / 분.초): ', Math.floor(time / 1000 / 60) + '.' + Math.floor((time / 1000) % 60));
    };

    const undo = () => {
        canvasRef.current?.undo();
    };

    const redo = () => {
        canvasRef.current?.redo();
    };

    const clearCanvas = () => {
        canvasRef.current?.clearCanvas();
    };

    const base64ToBlob = (img) => {
        const file = atob(img.split(',')[1]);
        const arrays = [];
        for (let i = 0; i < file.length; i++) {
            arrays.push(file.charCodeAt(i));
        }
        return new Blob([new Uint8Array(arrays)], {type: 'image/png'})
    }

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
                        border: "none"
                    }}
                    withTimestamp={true}
                />
            </div>
            <div className="tools">
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
                <div className="common_btn" onClick={save}>
                    저장
                </div>
            </div>
        </div>
    );
};

export default Drawing;
