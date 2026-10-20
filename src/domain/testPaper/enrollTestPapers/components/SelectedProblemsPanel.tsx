import { forwardRef } from "react";
import { difficultyMap, problemMap } from "../../../problem/utils/problemMap";
import type { ProblemResponse } from "../../../problem/types/problem";
import { getProblemImageUrl } from "../services/problemImage";

interface SelectedProblemsPanelProps {
  problems: ProblemResponse[];
  /** 방금 "조건대로 추가"로 들어온 문항. 강조해서 보여준다. */
  recentIds: Set<string>;
  onRemove: (index: number) => void;
}

/** 출제 전에 지금까지 선택된 문항을 확인하고 뺄 수 있는 목록. */
const SelectedProblemsPanel = forwardRef<HTMLDivElement, SelectedProblemsPanelProps>(
  function SelectedProblemsPanel({ problems, recentIds, onRemove }, ref) {
    if (problems.length === 0) return null;

    return (
      <div ref={ref} className="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-bold text-gray-900">선택된 문항 {problems.length}개</p>
            <p className="mt-1 text-xs text-gray-500">
              문항을 확인하고 필요 없는 문항은 선택 해제하세요.
              {recentIds.size > 0 && " 방금 추가된 문항은 진하게 표시됩니다."}
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-4">
          {problems.map((problem, index) => {
            const recent = recentIds.has(problem.id);
            return (
              <article
                key={problem.id}
                className={`overflow-hidden rounded-xl border bg-white ${
                  recent ? "border-gray-900 ring-1 ring-gray-900" : "border-gray-300"
                }`}
              >
                <header className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-3 py-2">
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {index + 1}. 문제 {problem.id}
                    </p>
                    <p className="text-xs text-gray-500">
                      {difficultyMap[problem.difficulty]} · {problemMap[problem.type]}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    선택 해제
                  </button>
                </header>
                <div className="p-3">
                  <img
                    src={getProblemImageUrl(problem.problemImage)}
                    alt={`${problem.id}번 문제`}
                    className="mx-auto max-h-40 w-auto object-contain"
                    loading="lazy"
                  />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    );
  }
);

export default SelectedProblemsPanel;
