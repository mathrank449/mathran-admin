import { useEffect, useState } from "react";
import { getSingleProblemSolutionById } from "../apis/problem";
import type { ProblemItemResponse, ProblemSolution } from "../types/problem";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const imageUrl = (imageSource: string) =>
  `${baseURL}/v1/image?imageSource=${imageSource}`;

// 문제 목록에서 행을 펼쳤을 때 상세 화면에 들어가지 않고 문제·풀이 이미지를 바로 보여준다.
function ProblemPreviewPanel({ problem }: { problem: ProblemItemResponse }) {
  const [solution, setSolution] = useState<ProblemSolution | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getSingleProblemSolutionById(String(problem.id))
      .then(setSolution)
      .catch(() => setSolution(null))
      .finally(() => setIsLoading(false));
  }, [problem.id]);

  return (
    <div className="w-[1650px] flex gap-6 px-8 py-6 bg-white border-solid border-[#DEDEDE] border-2 border-t-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-600 mb-2">문제</p>
        <img
          src={imageUrl(problem.problemImage)}
          alt="문제 이미지"
          className="max-w-full border border-gray-300"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-600 mb-2">
          풀이
          {solution && solution.answer.length > 0 && (
            <span className="ml-3 font-normal text-blue-600">
              정답 {solution.answer.join(", ")}
            </span>
          )}
        </p>
        {isLoading ? (
          <p className="text-sm text-gray-400">불러오는 중...</p>
        ) : solution?.solutionImage ? (
          <img
            src={imageUrl(solution.solutionImage)}
            alt="풀이 이미지"
            className="max-w-full border border-gray-300"
          />
        ) : (
          <p className="text-sm text-gray-400">등록된 풀이 이미지가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default ProblemPreviewPanel;
