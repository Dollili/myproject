import React, {useRef, useState} from "react";
import CanvasDraw from "react-canvas-draw";

const Drawing = ({onSave}) => {
    const canvasRef = useRef(null);
    const [color, setColor] = useState("#000000");
    const [bord, setBorder] = useState("");

    const saveDrawing = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const imageData = canvas.getDataURL(); // Base64 형식 이미지 데이터
            onSave(imageData); // 부모 컴포넌트로 전달
        }
    };

    const clearCanvas = () => {
        const cav = canvasRef.current;
        if (cav) {
            cav.clear();
        }
    };

    return (
        <div className="drawing">
            <CanvasDraw
                className="drawing-contents"
                ref={canvasRef}
                brushColor={color}
                brushRadius={bord}
            />
            <div>
                <div>선 굵기 선택</div>
                <select onChange={(e) => {
                    const {value} = e.target;
                    setBorder(value);
                }}>
                    {Array.from({length: 10}, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                            {i + 1}
                        </option>
                    ))}
                </select>
                {/*<button onClick={saveDrawing}>저장</button>*/}
            </div>
            <div>
                <div>색상 선택</div>
                <input
                    className=""
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                />
                {/*<button onClick={saveDrawing}>저장</button>*/}
            </div>
            <button className="common_btn" onClick={clearCanvas}>
                🧹 지우기
            </button>
        </div>
    );
};

export default Drawing;
