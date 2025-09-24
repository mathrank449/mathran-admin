import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const ReadOnlyCommentReactQuillEditor = ({
  contents,
}: {
  contents: string;
}) => {
  return (
    <ReactQuill
      theme="snow"
      value={contents}
      readOnly={true}
      modules={{ toolbar: false }} // 툴바 제거
      style={{ width: "800px", margin: "0 auto" }}
    />
  );
};

export default ReadOnlyCommentReactQuillEditor;
