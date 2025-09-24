// SolutionBoardPage.tsx
import { useRef, useState } from "react";
import ReactQuillEditor from "./ReactQuillEditor";
import ReactQuill from "react-quill-new";
import { postSolution } from "../../apis/solutionBoard";
import { useNavigate } from "@tanstack/react-router";

function WritingQuestionPage() {
  const quillRef = useRef<ReactQuill>(null);
  const [questionCategory, setQuestionCategory] = useState("notice");
  const [title, setTitle] = useState("");
  const [id, setId] = useState("0");
  const navigate = useNavigate();

  const onHandlePost = async () => {
    if (questionCategory === "problem") {
      if (id === "0") {
        alert("문제 번호를 입력해주세요");
        return;
      }
    }

    if (questionCategory === "testPaper") {
      if (id === "0") {
        alert("문제집 번호를 입력해주세요");
        return;
      }
    }

    if (questionCategory === "contest") {
      if (id === "0") {
        alert("대회 번호를 입력해주세요");
        return;
      }
    }

    if (title == "") {
      alert("제목을 입력해주세요");
      return;
    }

    let questionId;
    try {
      if (questionCategory == "problem") {
        questionId = await postSolution({
          postType: "SINGLE_PROBLEM",
          title,
          content: quillRef.current?.getEditor().root.innerHTML ?? "",
          problemId: id,
        });
      }

      if (questionCategory == "testPaper") {
        questionId = await postSolution({
          postType: "ASSESSMENT",
          title,
          content: quillRef.current?.getEditor().root.innerHTML ?? "",
          assessmentId: id,
        });
      }

      if (questionCategory == "contest") {
        questionId = await postSolution({
          postType: "CONTEST",
          title,
          content: quillRef.current?.getEditor().root.innerHTML ?? "",
          contestId: id,
        });
      }

      if (questionCategory == "free") {
        questionId = await postSolution({
          postType: "FREE",
          title,
          content: quillRef.current?.getEditor().root.innerHTML ?? "",
        });
      }

      if (questionCategory == "notice") {
        questionId = await postSolution({
          postType: "NOTICE",
          title,
          content: quillRef.current?.getEditor().root.innerHTML ?? "",
        });
      }
      navigate({ to: `/questions/${questionId}` });
    } catch (e) {
      console.log(e);
      alert("질문 글 작성 오류 발생");
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

        {/* 카테고리 & 문제 번호 */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <label htmlFor="category" className="font-medium">
              카테고리
            </label>
            <select
              id="category"
              name="category"
              value={questionCategory} // 상태와 연결
              onChange={(e) => setQuestionCategory(e.target.value)} // 선택 변경 시 상태 업데이트
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="notice">공지</option>
              <option value="problem">문제 질문</option>
              <option value="testPaper">문제집 질문</option>
              <option value="contest">대회 질문</option>
              <option value="free">자유</option>
            </select>
          </div>
          {questionCategory === "problem" && (
            <div className="flex items-center gap-4">
              <span className="font-medium">문제 번호</span>
              <input
                type="text"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-32"
                value={id}
                onChange={(e) => {
                  setId(e.target.value);
                }}
              />
            </div>
          )}
          {questionCategory === "testPaper" && (
            <div className="flex items-center gap-4">
              <span className="font-medium">문제집 번호</span>
              <input
                type="text"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-32"
                value={id}
                onChange={(e) => {
                  setId(e.target.value);
                }}
              />
            </div>
          )}
          {questionCategory === "contest" && (
            <div className="flex items-center gap-4">
              <span className="font-medium">대회 번호</span>
              <input
                type="text"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-32"
                value={id}
                onChange={(e) => {
                  setId(e.target.value);
                }}
              />
            </div>
          )}
        </div>

        {/* 에디터 */}
        <div className="border border-gray-300 rounded-lg overflow-hidden write">
          <ReactQuillEditor ref={quillRef} />
        </div>
        <div className="flex justify-center gap-6">
          <button
            className="my-3 cursor-pointer px-3 py-2 rounded-lg shadow transition bg-blue-500 text-white"
            onClick={onHandlePost}
          >
            글 쓰기
          </button>
          <button className="my-3 cursor-pointer px-3 py-2 rounded-lg shadow transition bg-blue-500 text-white">
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

export default WritingQuestionPage;
