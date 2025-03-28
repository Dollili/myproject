import React, {useRef} from "react";

const FileUpload = ({files, setFiles}) => {
    const click = useRef(null);

    const handleChangeFile = (e) => {
        setFiles(e.target.files);
    };

    const handleClearFiles = () => {
        setFiles(null);
        click.current.value = null;
    };

    return (
        <div className="fileForm">
            <input
                type="file"
                id="fileInput"
                onChange={handleChangeFile}
                ref={click}
                multiple
                hidden
            />
            {files && files.length > 0 && (
                <>
                    <div>
                        {Array.from(files).map((file, index) => (
                            <p key={index} onClick={() => {
                            }}>{file.name}</p>
                        ))}
                    </div>
                    <button onClick={handleClearFiles} className="common_btn">
                        파일 지우기
                    </button>
                </>
            )}
            <button className="common_btn" onClick={() => click.current.click()}>
                첨부
            </button>
        </div>
    );
};

export default FileUpload;
