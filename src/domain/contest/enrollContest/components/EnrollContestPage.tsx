import { useEffect, useState } from "react";
import type { ProblemResponse } from "../../../problem/types/problem";
import ProblemPicker from "../../../testPaper/enrollTestPapers/components/ProblemPicker";
import { useContestStore } from "../hooks/useContestStore";
import { CONTEST_MAX_PROBLEMS } from "../services/contestDraft";
import EnrollContestInfoPage from "./EnrollContestInfoPage";

function EnrollContestPage() {
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const contestProblems = useContestStore((state) => state.contestProblems);
  const insertProblem = useContestStore((state) => state.insertProblem);
  const removeProblem = useContestStore((state) => state.removeProblem);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [isEditingInfo]);

  const addProblems = async (problems: ProblemResponse[]) => {
    problems.forEach((problem) => insertProblem({ ...problem, score: 0 }));
  };

  return (
    <main className="mx-auto w-[1480px] pb-20 pt-16">
      <div className="mb-8 flex items-end justify-between border-b border-gray-300 pb-5">
        <div>
          <p className="text-sm text-gray-500">출제 / 경시대회 등록</p>
          <h1 className="mt-1 text-3xl font-bold text-gray-900">경시대회 등록</h1>
        </div>
        <p className="text-sm text-gray-600">선택 문항 {contestProblems.length}개</p>
      </div>

      {isEditingInfo ? (
        <EnrollContestInfoPage onBack={() => setIsEditingInfo(false)} />
      ) : (
        <ProblemPicker
          selected={contestProblems}
          maxCount={CONTEST_MAX_PROBLEMS}
          onAdd={addProblems}
          onRemove={removeProblem}
          footer={
            <>
              <div>
                <p className="font-bold text-gray-900">선택 문항 {contestProblems.length}개</p>
                <p className="mt-1 text-xs text-gray-500">
                  다음 화면에서 대회 정보와 문항 순서·배점을 정합니다.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingInfo(true)}
                disabled={contestProblems.length === 0}
                className="rounded-lg bg-gray-900 px-7 py-3 font-bold text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                선택 완료 · 대회 정보 입력
              </button>
            </>
          }
        />
      )}
    </main>
  );
}

export default EnrollContestPage;
