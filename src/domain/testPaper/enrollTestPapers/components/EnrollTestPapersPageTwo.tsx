import { difficultyMap, problemMap } from "../../../problem/utils/problemMap";
import type { ProblemResponse } from "../../../problem/types/problem";
import { getProblemImageUrl } from "../services/problemImage";

interface EnrollTestPapersPageTwoProps {
  problems: ProblemResponse[];
  selectedIds: Set<string>;
  selectingId: string | null;
  onToggle: (problem: ProblemResponse) => void;
}

function EnrollTestPapersPageTwo({
  problems,
  selectedIds,
  selectingId,
  onToggle,
}: EnrollTestPapersPageTwoProps) {
  if (problems.length === 0) {
    return (
      <div className="grid min-h-64 place-items-center border-t border-gray-200 text-gray-500">
        조건에 맞는 문제가 없습니다.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6 border-t border-gray-200 pt-6">
      {problems.map((problem) => {
        const selected = selectedIds.has(problem.id);
        return (
          <article
            key={problem.id}
            className={`overflow-hidden rounded-xl border bg-white ${
              selected ? "border-gray-900 ring-1 ring-gray-900" : "border-gray-300"
            }`}
          >
            <header className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-5 py-4">
              <div>
                <p className="font-bold text-gray-900">문제 {problem.id}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {difficultyMap[problem.difficulty]} · {problemMap[problem.type]}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onToggle(problem)}
                disabled={selectingId === problem.id}
                className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                  selected
                    ? "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                    : "border-gray-900 bg-gray-900 text-white hover:bg-gray-700"
                } disabled:cursor-wait disabled:opacity-50`}
              >
                {selectingId === problem.id
                  ? "이미지 확인 중"
                  : selected
                    ? "선택 해제"
                    : "문항 선택"}
              </button>
            </header>
            <div className="p-5">
              <img
                src={getProblemImageUrl(problem.problemImage)}
                alt={`${problem.id}번 문제`}
                className="h-auto w-full object-contain"
                loading="lazy"
              />
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default EnrollTestPapersPageTwo;
