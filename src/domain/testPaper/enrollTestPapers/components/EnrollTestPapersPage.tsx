import { useState } from "react";
import { useTestPapersStore } from "../hooks/useTestPapers";
import EnrollTestPapersOnePage from "./EnrollTestPapersOnePage";
import EnrollTestPapersPageThree from "./EnrollTestPapersPageThree";

function EnrollTestPapersPage() {
  const [isEditingPdf, setIsEditingPdf] = useState(false);
  const selectedCount = useTestPapersStore((state) => state.testPapers.length);

  return (
    <main className="mx-auto w-[1480px] pb-20 pt-16">
      <div className="mb-8 flex items-end justify-between border-b border-gray-300 pb-5">
        <div>
          <p className="text-sm text-gray-500">출제 / 시험지 등록</p>
          <h1 className="mt-1 text-3xl font-bold text-gray-900">시험지 등록</h1>
        </div>
        <p className="text-sm text-gray-600">선택 문항 {selectedCount}개</p>
      </div>

      {isEditingPdf ? (
        <EnrollTestPapersPageThree onBack={() => setIsEditingPdf(false)} />
      ) : (
        <EnrollTestPapersOnePage onContinue={() => setIsEditingPdf(true)} />
      )}
    </main>
  );
}

export default EnrollTestPapersPage;
