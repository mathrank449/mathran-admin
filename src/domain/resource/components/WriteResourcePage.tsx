import { useRef, useState } from "react";
import type { ResourceType } from "../types/resource";
import FileUpload from "./FileUpload";
import VideoLinkInput from "./VideoLinkInput";
import ReactQuillEditor from "../../solutionBoard/write/components/ReactQuillEditor";
import type ReactQuill from "react-quill-new";

function WriteResourcePage() {
  const quillRef = useRef<ReactQuill>(null);
  const [resourceCategory, setResourceCategory] =
    useState<ResourceType>("testPaper");
  const [title, setTitle] = useState("");

  const onHandlePost = async () => {
    if (title == "") {
      alert("제목을 입력해주세요");
      return;
    }
  };

  return (
    <div className="w-full max-w-[1680px] mx-auto mt-24 px-4">
      <div className="w-full max-w-[800px] mx-auto flex flex-col gap-6">
        {/* 제목 입력 */}
        <input
          className="text-4xl font-semibold py-4 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="제목을 입력하세요."
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />

        {/* 카테고리 */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <label htmlFor="category" className="font-medium">
              카테고리
            </label>
            <select
              id="category"
              name="category"
              value={resourceCategory} // 상태와 연결
              onChange={(e) =>
                setResourceCategory(e.target.value as ResourceType)
              } // 선택 변경 시 상태 업데이트
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="testPaper">문제집</option>
              <option value="schoolPaper">내신 문제집</option>
              <option value="video">영상</option>
            </select>
          </div>
        </div>

        {/* 에디터 */}
        {/* 에디터 */}
        <div className="border border-gray-300 rounded-lg overflow-hidden write">
          <ReactQuillEditor ref={quillRef} />
        </div>

        {resourceCategory === "testPaper" && (
          <div>
            <FileUpload />
          </div>
        )}
        {resourceCategory === "schoolPaper" && (
          <div>
            {" "}
            <FileUpload />
          </div>
        )}
        {resourceCategory === "video" && (
          <div>
            <VideoLinkInput />
          </div>
        )}
        <div className="flex justify-center gap-6">
          <button
            className="my-3 cursor-pointer px-3 py-2 rounded-lg shadow transition bg-blue-500 text-white"
            onClick={onHandlePost}
          >
            자료 저장
          </button>
          <button className="my-3 cursor-pointer px-3 py-2 rounded-lg shadow transition bg-blue-500 text-white">
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

export default WriteResourcePage;
