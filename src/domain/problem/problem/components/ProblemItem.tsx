import { difficultyToKorean } from "../../utils/difficultyTransform";
import type { ProblemItemResponse } from "../types/problem";

function ProblemItem({
  problem,
  index,
}: {
  problem: ProblemItemResponse;
  index: number;
}) {
  console.log(problem);
  return (
    <div
      className={`w-[1650px] whitespace-nowrap py-3 border-solid border-[#DEDEDE] border-2 border-t-0 ${
        index % 2 === 0 ? "bg-white " : " bg-gray-100"
      }`}
    >
      <div className="inline-block align-middle w-[150px] text-center overflow-hidden truncate">
        <span
          className="text-sm text-black whitespace-nowrap"
          title={String(problem.id)}
        >
          {problem.id}
        </span>
      </div>
      <div className="inline-block align-middle w-[500px] text-center overflow-hidden truncate">
        <a
          className="text-sm text-blue-500 whitespace-nowrap mr-4"
          title={String(problem.singleProblemName)}
          href={`/problems/${problem.id}`}
        >
          {problem.singleProblemName}
        </a>
        <span>
          {problem.successAtFirstTry === true && (
            <span className="text-md px-3 py-1 rounded-xl border-solid border border-blue-500 bg-blue-500 text-white">
              성공
            </span>
          )}
          {problem.successAtFirstTry === false && (
            <span className="text-md px-3 py-1 rounded-xl border-solid border border-red-500 bg-red-500 text-white">
              실패
            </span>
          )}
        </span>
      </div>
      <div className="inline-block align-middle w-[400px] text-center overflow-hidden truncate">
        {problem.courseInfo.parents.map((course) => (
          <span
            className="text-sm text-black whitespace-nowrap"
            title={String(course.courseName)}
          >
            {course.courseName.replace(/^\d+\s*/, "")}/
          </span>
        ))}
        <span
          className="text-sm text-black whitespace-nowrap"
          title={String(problem.courseInfo.target.courseName)}
        >
          {problem.courseInfo.target.courseName.replace(/^\d+\s*/, "")}
        </span>
      </div>
      <div className="inline-block align-middle w-[150px] text-center overflow-hidden truncate">
        <span
          className="text-sm text-black whitespace-nowrap"
          title={String(problem.difficulty)}
        >
          {difficultyToKorean(problem.difficulty)}
        </span>
      </div>
      <div className="inline-block align-middle w-[150px] text-center overflow-hidden truncate">
        <span
          className="text-sm text-black whitespace-nowrap"
          title={String(problem.firstTrySuccessCount)}
        >
          {problem.firstTrySuccessCount}
        </span>
      </div>
      <div className="inline-block align-middle w-[150px] text-center overflow-hidden truncate">
        <span
          className="text-sm text-black whitespace-nowrap"
          title={String(problem.attemptedUserDistinctCount)}
        >
          {problem.attemptedUserDistinctCount}
        </span>
      </div>
      <div className="inline-block align-middle w-[150px] text-center overflow-hidden truncate">
        <span
          className="text-sm text-black whitespace-nowrap"
          title={String(problem.accuracy)}
        >
          {problem.accuracy}%
        </span>
      </div>
    </div>
  );
}

export default ProblemItem;
