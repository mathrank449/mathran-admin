import type { ProblemResponse } from "../../../problem/types/problem";
import { useTestPapersStore } from "../hooks/useTestPapers";
import { loadImageAspectRatio } from "../services/problemImage";
import ProblemPicker from "./ProblemPicker";

function EnrollTestPapersOnePage({ onContinue }: { onContinue: () => void }) {
  const testPapers = useTestPapersStore((state) => state.testPapers);
  const insertTestPapers = useTestPapersStore((state) => state.insertTestPapers);
  const removeTestPaper = useTestPapersStore((state) => state.removeTestPaper);

  const addProblems = async (problems: ProblemResponse[]) => {
    const prepared = await Promise.all(
      problems.map(async (problem) => ({
        ...problem,
        score: 0,
        pdfGapAfter: 16,
        imageAspectRatio: await loadImageAspectRatio(problem.problemImage),
      }))
    );
    prepared.forEach(insertTestPapers);
  };

  return (
    <ProblemPicker
      selected={testPapers}
      maxCount={50}
      onAdd={addProblems}
      onRemove={removeTestPaper}
      footer={
        <>
          <div>
            <p className="font-bold text-gray-900">선택 문항 {testPapers.length}개</p>
            <p className="mt-1 text-xs text-gray-500">PDF 편집 화면에서 순서와 문항 사이 공백을 조절합니다.</p>
          </div>
          <button
            type="button"
            onClick={onContinue}
            disabled={testPapers.length === 0}
            className="rounded-lg bg-gray-900 px-7 py-3 font-bold text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            선택 완료 · PDF 편집
          </button>
        </>
      }
    />
  );
}

export default EnrollTestPapersOnePage;
