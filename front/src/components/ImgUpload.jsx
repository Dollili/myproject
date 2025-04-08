import React from "react";

const ImgUpload = ({files, setFiles, data, onOff, click}) => {
    const handleChangeFile = (e) => {
        setFiles((prev) => [...(prev || []), ...e.target.files]);
    };

    const handleClearFiles = () => {
        setFiles([]);
        click.current.value = null;
    };

    return (
        <>
            {!onOff && (
                <>
                    <div className="fileForm">
                        <input
                            type="file"
                            id="fileInput"
                            accept="/image/*"
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
                    </div>
                    <button
                        className="common_btn mg"
                        onClick={() => click.current.click()}
                    >
                        첨부
                    </button>
                </>
            )
            }
        </>
    )
        ;
};

export default ImgUpload;
