// ReactQuillEditor.tsx
import { forwardRef, memo } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { uploadImageToServer } from "../../../../shared/apis/image";

const baseURL = import.meta.env.VITE_API_BASE_URL;

// 커스텀 툴바 옵션
const toolbarOptions = [
  [{ header: 1 }, { header: 2 }, { header: 3 }, { header: 4 }],
  ["bold", "italic", "underline", "strike"], // 글자 스타일
  ["blockquote"],
  [{ color: [] }, { background: [] }],
  ["image", "video"], // 이미지, 비디오 버튼
];

interface ReactQuillEditorProps {
  value?: string;
}

const ReactQuillEditor = forwardRef<ReactQuill, ReactQuillEditorProps>(
  ({ value = "" }, ref) => {
    const handleChange = (content: string) => {
      console.log(content);
    };

    /** 🖼 이미지 업로드 핸들러 */
    const handleImageUpload = () => {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click();

      input.onchange = async () => {
        if (!input.files?.length) return;
        const file = input.files[0];

        const imageSource = await uploadImageToServer(file);
        const imageUrl = baseURL + `/v1/image?imageSource=${imageSource}`;

        const quillRefCurrent = ref as React.RefObject<ReactQuill>;
        const quill = quillRefCurrent?.current;
        if (!quill) return;

        const range = quill.getEditor().getSelection();
        const index = range ? range.index : 0;
        quill.getEditor().insertEmbed(index, "image", imageUrl);
      };
    };

    const modules = {
      toolbar: {
        container: toolbarOptions,
        handlers: {
          image: handleImageUpload,
        },
      },
    };

    console.log("렌더링");

    return (
      <ReactQuill
        ref={ref}
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        style={{ width: "800px", margin: "0 auto" }}
      />
    );
  }
);

// ✅ memo로 감싸서 value가 바뀔 때만 리렌더링
export default memo(
  ReactQuillEditor,
  (prev, next) => prev.value === next.value
);
