// SolutionBoardPage.tsx
import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import type { Question } from "../types/question";
import ReadOnlyReactQuillEditor from "../../write/components/ReadOnlyReactQuillEditor";
import CommentBox from "../comments/components/CommentBox";
import ReactQuillEditor from "../../write/components/ReactQuillEditor";
import { getQuestionById } from "../apis/question";
import { postComment } from "../comments/apis/comment";
import { deleteSolution } from "../../apis/solutionBoard";
import { useNavigate } from "@tanstack/react-router";

function QuestionDetailPage({ questionId }: { questionId: string }) {
  const quillRef = useRef<ReactQuill>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const [question, setQuestion] = useState<Question | undefined>(undefined);
  const [isWritingComment, setIsWritingComment] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const questionResponse = await getQuestionById(questionId);
      setQuestion(questionResponse);
    };
    fetchData();
  }, [questionId]);

  const handlePostComment = async () => {
    try {
      await postComment(
        questionId,
        quillRef.current?.getEditor().root.innerHTML ?? ""
      );
      setIsWritingComment(false);

      const questionResponse = await getQuestionById(questionId);
      setQuestion(questionResponse);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeletePost = async () => {
    // 확인
    const confirmed = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmed) return; // 취소하면 종료

    try {
      await deleteSolution(questionId);
      alert("게시글이 삭제되었습니다.");
      // 필요 시 삭제 후 이동 처리
      // 예: navigate("/questions");
      navigate({ to: "/solution-board/list/all" });
    } catch (e) {
      console.error(e);
      alert("게시글 삭제중 오류가 발생하였습니다.");
    }
  };

  if (question === undefined) return <div>로딩중</div>;
  return (
    <div className="w-full max-w-[1680px] mx-auto mt-24 px-4">
      <div className="w-full max-w-[800px] mx-auto flex flex-col gap-6">
        {/* 제목 입력 */}
        <span className="text-4xl font-semibold py-4 px-3">
          {question.postId}. {question.title}
        </span>

        {/* 카테고리 & 문제 번호 */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <span className="font-medium text-lg whitespace-nowrap mr-4">
              카테고리
            </span>
            {question.postType == "FREE" && (
              <span className="text-sm text-black-500 whitespace-nowrap mr-4">
                자유
              </span>
            )}

            {question.postType == "NOTICE" && (
              <span className="text-sm text-red-500 whitespace-nowrap mr-4">
                공지
              </span>
            )}

            {question.postType == "SINGLE_PROBLEM" && (
              <a
                className="text-lg text-blue-500 whitespace-nowrap mr-4"
                href={`/problems/${question.singleProblemId}`}
              >
                문제
              </a>
            )}

            {question.postType == "ASSESSMENT" && (
              <a
                className="text-sm text-blue-500 whitespace-nowrap mr-4"
                href={`/teatPapers/${question.assessmentId}`}
              >
                시험지
              </a>
            )}

            {question.postType == "CONTEST" && (
              <a
                className="text-sm text-blue-500 whitespace-nowrap mr-4"
                href={`/contests/${question.contestId}`}
              >
                대회
              </a>
            )}
          </div>
          {question.postType == "SINGLE_PROBLEM" && (
            <div className="flex items-center gap-4">
              <span className="font-medium">문제 번호</span>
              <span className="px-3 py-2 w-32">{question.singleProblemId}</span>
            </div>
          )}
          {question.postType == "ASSESSMENT" && (
            <div className="flex items-center gap-4">
              <span className="font-medium">문제집 번호</span>
              <span className="px-3 py-2 w-32">{question.assessmentId}</span>
            </div>
          )}
          {question.postType == "CONTEST" && (
            <div className="flex items-center gap-4">
              <span className="font-medium">대회 번호</span>
              <span className="px-3 py-2 w-32">{question.contestId}</span>
            </div>
          )}
        </div>

        {/* 에디터 */}
        <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
          <ReadOnlyReactQuillEditor contents={question.content} />
        </div>
        <div className="flex flex-col gap-4">
          {question.comments.map((comment) => (
            <CommentBox comment={comment} />
          ))}
        </div>
        <div className="text-center">
          <button
            className={`my-3 mt-16 cursor-pointer px-3 py-2 rounded-lg shadow transition mr-4
    ${
      isWritingComment
        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
        : "bg-blue-500 text-white hover:bg-blue-600"
    }
  `}
            disabled={isWritingComment}
            onClick={() => {
              setIsWritingComment(true);
              // 댓글 입력 창으로 스크롤

              // 버튼 클릭 시
              setTimeout(() => {
                if (commentsEndRef.current) {
                  commentsEndRef.current?.scrollIntoView({
                    behavior: "smooth",
                  });
                }
              }, 100);
            }}
          >
            댓글 작성
          </button>

          <button
            type="button"
            className="my-3 mt-16 cursor-pointer px-3 py-2 rounded-lg shadow transition bg-blue-500 text-white hover:bg-blue-600"
            onClick={handleDeletePost}
          >
            게시글 삭제
          </button>

          {isWritingComment && (
            <div ref={commentsEndRef}>
              <ReactQuillEditor ref={quillRef} />
              <button
                className="my-3 mt-16 cursor-pointer px-3 py-2 rounded-lg shadow transition bg-blue-500 text-white"
                onClick={handlePostComment}
              >
                저장
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuestionDetailPage;
