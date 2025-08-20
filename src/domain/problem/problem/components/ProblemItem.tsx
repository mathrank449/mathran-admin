import type { ProblemItemResponse } from "../types/problem";

function ProblemItem({
  problem,
  index,
}: {
  problem: ProblemItemResponse;

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
          title={String(problem.id)}
        >
          {problem.id}
        </span>
      </div>
      <div className="inline-block align-middle w-[600px] text-center overflow-hidden truncate">
        <a
          className="text-sm text-blue-500 whitespace-nowrap"
          title={String(problem.title)}
          href={`/problems/${problem.id}`}
        >
          {problem.title}
        </a>
      </div>
      <div className="inline-block align-middle w-[200px] text-center overflow-hidden truncate">
        <span
          className="text-sm text-black whitespace-nowrap"
          title={String(problem.coursePath)}
        >
          {problem.coursePath}
        </span>
      </div>
      <div className="inline-block align-middle w-[150px] text-center overflow-hidden truncate">
        <span
          className="text-sm text-black whitespace-nowrap"
          title={String(problem.difficulty)}
        >
          {problem.difficulty}
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
      <div className="inline-block align-middle w-[200px] text-center overflow-hidden truncate">
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
          {problem.accuracy}
        </span>
      </div>
    </div>
  );
}

export default ProblemItem;
