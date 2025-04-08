import React, {useRef} from "react";

const FileUpload = ({files, setFiles, data, onOff}) => {
    const click = useRef(null);

    const handleChangeFile = (e) => {
        setFiles((prev) => [...(prev || []), ...e.target.files]);
    };

    const handleClearFiles = () => {
        setFiles(null);
        click.current.value = null;
    };

    return (
        <>
            {!onOff && (
                <div className="fileForm">
                    <input
                        type="file"
                        id="fileInput"
                        onChange={handleChangeFile}
                        ref={click}
                        multiple
                        hidden
                    />
                    {files?.length > 0 && (
                        <>
                            {data.file && <p>추가된 파일</p>}
                            <div className="file-div">
                                {Array.from(files).map((file, index) => (
                                    <div key={index} onClick={() => {
                                    }}>
                                        {file.name}
                                    </div>
                                ))}
                            </div>
                            <button onClick={handleClearFiles} className="common_btn mg">
                                전체 삭제
                            </button>
                        </>
                    )}
                    <button
                        className="common_btn mg"
                        onClick={() => click.current.click()}
                    >
                        첨부
                    </button>
                </div>
            )}
        </>
    );
};

export default FileUpload;
