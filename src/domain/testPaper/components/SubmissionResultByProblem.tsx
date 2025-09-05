import type { SubmissionLogProblemItemResult } from "../../submissionLog/types/submissionLog";

function SubmissionResultByProblem({
  index,
  submissionProblem, // 오타 수정
}: {
  index: number;
  submissionProblem: SubmissionLogProblemItemResult;
}) {
  return (
    <div
      className={`whitespace-nowrap py-2 font-bold ${
        index % 2 === 0 ? "bg-white" : "bg-gray-100"
      }`}
    >
      <div className="inline-block align-middle w-[100px] text-left pl-4 overflow-hidden truncate">
        <span
          className="text-sm text-black whitespace-nowrap"
          title={String(index + 1)}
        >
          {index + 1}번 문제
        </span>
      </div>

      <div className="inline-block align-middle w-[80px] text-center overflow-hidden truncate">
        <div className="flex flex-col gap-1 text-center">
          {submissionProblem.correct ? (
            <span className="ml-2 text-md px-3 py-1 text-center rounded-xl border-solid border border-blue-500 bg-blue-500 text-white">
              정답
            </span>
          ) : (
            <span className="ml-2 text-md px-3 py-1 text-center rounded-xl border-solid border border-red-500 bg-red-500 text-white">
              오답
            </span>
          )}
          <span
            className="text-sm text-black whitespace-nowrap"
            title={String(submissionProblem.score)}
          >
            {submissionProblem.score}점
          </span>
        </div>
      </div>

      <div className="inline-block align-middle w-[160px] text-center overflow-hidden truncate">
        <span
          className="text-sm text-black whitespace-nowrap"
          title={submissionProblem.submittedAnswer.join(", ")}
        >
          {submissionProblem.submittedAnswer.join(", ")}
        </span>
      </div>

      <div className="inline-block align-middle w-[160px] text-center overflow-hidden truncate">
        <span
          className="text-sm text-black whitespace-nowrap"
          title={submissionProblem.correctAnswer.join(", ")}
        >
          {submissionProblem.correctAnswer.join(", ")}
        </span>
      </div>
    </div>
  );
}

export default SubmissionResultByProblem;
