import type { QuestionPostItem } from "../../types/question";

function QuestionItem({
  question,
  index,
}: {
  question: QuestionPostItem;
  index: number;
}) {
  return (
    <div
      className={`w-[1650px] whitespace-nowrap py-3 border-solid border-[#DEDEDE] border-2 border-t-0 ${
        index % 2 === 0 ? "bg-white " : " bg-gray-100"
      }`}
    >
      <div className="inline-block align-middle w-[200px] text-center overflow-hidden truncate">
        <span
          className="text-sm text-black whitespace-nowrap"
          title={String(question.postId)}
        >
          {question.postId}
        </span>
      </div>
      <div className="inline-block align-middle w-[550px] text-center overflow-hidden truncate">
        <a
          className="text-sm text-blue-500 whitespace-nowrap mr-4"
          title={String(question.title)}
          href={`/questions/${question.postId}`}
        >
          {question.title}
        </a>
      </div>
      <div className="inline-block align-middle w-[400px] text-center overflow-hidden truncate">
        {question.postType === "FREE" && (
          <span
            className="text-sm text-blue-500 whitespace-nowrap mr-4"
            title={String(question.postType)}
          >
            자유글
          </span>
        )}
        {question.postType === "NOTICE" && (
          <span
            className="text-sm text-blue-500 whitespace-nowrap mr-4"
            title={String(question.postType)}
          >
            공지사항
          </span>
        )}

        {question.postType === "SINGLE_PROBLEM" && (
          <a
            className="text-sm text-blue-500 whitespace-nowrap mr-4"
            href={`/problems/${question.singleProblemId}`}
          >
            [문제] {question.singleProblemId}
          </a>
        )}

        {question.postType === "ASSESSMENT" && (
          <a
            className="text-sm text-blue-500 whitespace-nowrap mr-4"
            href={`/teatPapers/${question.assessmentId}`}
          >
            [시험지] {question.assessmentId}
          </a>
        )}

        {question.postType === "CONTEST" && (
          <a
            className="text-sm text-blue-500 whitespace-nowrap mr-4"
            href={`/contests/${question.contestId}`}
          >
            [경시대회] {question.contestId}
          </a>
        )}
      </div>
      <div className="inline-block align-middle w-[150px] text-center overflow-hidden truncate">
        <span
          className="text-sm text-black whitespace-nowrap"
          title={String(question.memberNickName)}
        >
          {question.memberNickName}
        </span>
      </div>
      <div className="inline-block align-middle w-[150px] text-center overflow-hidden truncate">
        <span
          className="text-sm text-black whitespace-nowrap"
          title={String(question.commentCount)}
        >
          {question.commentCount}
        </span>
      </div>
      <div className="inline-block align-middle w-[200px] text-center overflow-hidden truncate">
        <span
          className="text-sm text-black whitespace-nowrap"
          title={String(question.createdAt)}
        >
          {new Date(question.createdAt)
            .toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .replace(/\s/g, "")}
        </span>
      </div>
    </div>
  );
}

export default QuestionItem;
