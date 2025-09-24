// SolutionBoardPage.tsx
import { useEffect, useRef, useState } from "react";
import ReactQuillEditor from "../../write/components/ReactQuillEditor";
import ReactQuill from "react-quill-new";
import { modifySolution } from "../../apis/solutionBoard";
import { useNavigate } from "@tanstack/react-router";
import { getUserInfo } from "../../../user/apis/user";
import { getQuestionById } from "../apis/question";

function QuestionModifyPage({ questionId }: { questionId: string }) {
  const quillRef = useRef<ReactQuill>(null);
  const [questionCategory, setQuestionCategory] = useState("problem");
  const [title, setTitle] = useState("");
  const [id, setId] = useState("0");
  const navigate = useNavigate();
  const [isMyQuestion, setIsMyQuestion] = useState(false);
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const userInfo = await getUserInfo();
      const questionResponse = await getQuestionById(questionId);
      if (userInfo.memberId === questionResponse.memberInfo.memberId) {
        setIsMyQuestion(true);
      }

      setTitle(questionResponse.title);
      setContent(questionResponse.content);
      if (questionResponse.postType == "SINGLE_PROBLEM") {
        setId(questionResponse.singleProblemId ?? "");
        setQuestionCategory("problem");
      }
      if (questionResponse.postType == "ASSESSMENT") {
        setId(questionResponse.assessmentId ?? "");
        setQuestionCategory("testPaper");
      }
      if (questionResponse.postType == "CONTEST") {
        setId(questionResponse.contestId ?? "");
        setQuestionCategory("contest");
      }
    };
    fetchData();
  }, [questionId]);

  const onHandleModifyPost = async () => {
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

    try {
      if (questionCategory == "problem") {
        await modifySolution(questionId, {
          title,
          content: quillRef.current?.getEditor().root.innerHTML ?? "",
        });
      }

      navigate({ to: `/questions/${questionId}` });
    } catch (e) {
      console.log(e);
      alert("질문 글 수정 오류 발생");
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
              disabled
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
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
          <ReactQuillEditor ref={quillRef} value={content} />
        </div>
        {isMyQuestion && (
          <div className="flex justify-center gap-6">
            <button
              className="my-3 cursor-pointer px-3 py-2 rounded-lg shadow transition bg-blue-500 text-white"
              onClick={onHandleModifyPost}
            >
              수정 완료
            </button>
            <button
              className="my-3 cursor-pointer px-3 py-2 rounded-lg shadow transition bg-blue-500 text-white"
              onClick={() => {
                navigate({ to: `/questions/${questionId}` });
              }}
            >
              취소
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuestionModifyPage;
