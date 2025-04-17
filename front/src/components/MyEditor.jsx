import {useMemo, useRef} from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import api from "../services/axiosInterceptor";

const MyEditor = ({onChange, value}) => {
    const quillRef = useRef();

    const handleChange = () => {
        const editor = quillRef.current.getEditor(); // Quill 인스턴스
        const html = editor.root.innerHTML; // 에디터 내용 HTML로 가져오기
        onChange(html);
    };

    // 이미지 업로드 핸들러
    const imageHandler = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            const formData = new FormData();
            formData.append("file", file);

            try {
                const res = await api.post("/file/upload/temp", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                const url = res.data.url;

                const editor = quillRef.current.getEditor();
                const range = editor.getSelection();
                editor.insertEmbed(range.index, "image", url);
            } catch (e) {
                console.error(e);
            }
        };
    };

    const modules = useMemo(() => {
        return {
            toolbar: {
                container: [
                    [{header: [1, 2, 3, false]}],
                    [{font: []}],
                    [{color: []}, {background: []}],
                    [{script: "sub"}, {script: "super"}],
                    ["bold", "italic", "underline", "strike", "blockquote"],
                    ["image"],
                    [{align: []}],
                    ["code-block"],
                    ["clean"],
                ],
                handlers: {
                    image: imageHandler,
                },
            },
        };
    }, []);

    return (
        <div style={{height: "400px"}}>
            {/*toolbar 길이 반영 안해줌*/}
            <ReactQuill
                ref={quillRef}
                theme="snow"
                value={value}
                style={{height: "90%"}}
                onChange={handleChange}
                modules={modules}
                placeholder="내용을 입력하세요"
            />
        </div>
    );
};

export default MyEditor;
