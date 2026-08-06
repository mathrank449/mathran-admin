import { useState } from "react";
import { difficultyMap, problemMap } from "../../../problem/utils/problemMap";
import { enrollTestPapers } from "../apis/testPapers";
import { useTestPapersStore } from "../hooks/useTestPapers";
import { downloadPdf, generateAssessmentPdf } from "../services/assessmentPdf";
import { PDF_MAX_GAP } from "../services/pdfLayoutPlanner";
import {
  downloadMathRankLogo,
  downloadProblemImage,
  getProblemImageUrl,
  renderTitleImage,
} from "../services/problemImage";
import type { AssessmentPdfDraft } from "../types/assessmentPdf";
import { validateAssessmentPdfDraft } from "../types/assessmentPdf";
import AssessmentPdfPreview from "./AssessmentPdfPreview";

function EnrollTestPapersPageThree({ onBack }: { onBack: () => void }) {
  const {
    testPapers,
    selectedIndex,
    setSelectedIndex,
    setTestPapersScore,
    setTestPapersGap,
    removeTestPaper,
    reorderTestPaper,
    rebalanceScores,
    time,
    setTime,
    title,
    setTitle,
    columnCount,
    setColumnCount,
    createdAssessmentId,
    setCreatedAssessmentId,
  } = useTestPapersStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const problem = testPapers[selectedIndex];

  if (!problem) {
    return (
      <div className="rounded-xl border border-gray-300 p-10 text-center">
        <p className="text-gray-600">선택한 문항이 없습니다.</p>
        <button
          type="button"
          onClick={onBack}
          className="mt-5 rounded-lg bg-gray-900 px-5 py-2 font-semibold text-white"
        >
          문항 선택으로 돌아가기
        </button>
      </div>
    );
  }

  const makeDraft = (): AssessmentPdfDraft => ({
    title,
    minutes: time,
    columnCount,
    items: testPapers,
  });

  const createAndDownloadPdf = async () => {
    const draft = makeDraft();
    const validationMessage = validateAssessmentPdfDraft(draft);
    if (validationMessage) {
      setMessage(validationMessage);
      return;
    }

    setIsGenerating(true);
    setMessage("문제 이미지를 내려받고 PDF를 생성하고 있습니다.");
    try {
      const assessmentId = createdAssessmentId ?? (await enrollTestPapers(draft));
      if (!createdAssessmentId) setCreatedAssessmentId(assessmentId);

      const problemImages = [];
      for (const item of draft.items) {
        problemImages.push({ bytes: await downloadProblemImage(item.problemImage) });
      }
      const generated = await generateAssessmentPdf({
        draft,
        assessmentId,
        logoBytes: await downloadMathRankLogo(),
        titleImageBytes: await renderTitleImage(draft.title),
        problemImages,
      });
      downloadPdf(generated.bytes, `mathrank-${assessmentId}.pdf`);
      setMessage(
        `시험지 ${assessmentId} 등록과 PDF ${generated.pageCount}페이지 생성을 완료했습니다.`
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "시험지 PDF를 생성하지 못했습니다."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
        >
          ← 문항 선택
        </button>
        <p className="text-sm text-gray-500">
          미리보기에서 문항을 클릭해 편집하고, 끌어 놓아 순서를 바꿀 수 있습니다.
        </p>
      </div>

      <div className="grid grid-cols-[560px_1fr] items-start gap-10">
        <section className="space-y-5 rounded-xl border border-gray-300 bg-white p-6">
          <div className="grid grid-cols-[1fr_140px] gap-3">
            <label className="text-sm font-semibold text-gray-700">
              시험지 제목
              <input
                type="text"
                placeholder="시험지 제목을 입력하세요"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 font-normal outline-none focus:border-gray-700"
              />
            </label>
            <label className="text-sm font-semibold text-gray-700">
              제한 시간
              <div className="mt-2 flex items-center rounded-lg border border-gray-300 px-3">
                <input
                  type="number"
                  min={16}
                  max={600}
                  value={time}
                  onChange={(event) => setTime(Number(event.target.value))}
                  className="w-full py-3 text-right outline-none"
                />
                <span className="ml-2 text-sm text-gray-500">분</span>
              </div>
            </label>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-gray-800">페이지 구성</p>
              <p className="text-xs text-gray-500">2단은 왼쪽 열부터 자동 배치됩니다.</p>
            </div>
            <div className="flex rounded-lg border border-gray-300 bg-white p-1">
              {([1, 2] as const).map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setColumnCount(count)}
                  className={`rounded-md px-5 py-2 text-sm font-semibold ${
                    columnCount === count
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {count}단
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-gray-300">
            <div className="border-b border-gray-200 bg-gray-50 p-4">
              <label className="text-xs font-semibold text-gray-500">
                편집 문항
                <select
                  value={selectedIndex}
                  onChange={(event) => setSelectedIndex(Number(event.target.value))}
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
                >
                  {testPapers.map((item, index) => (
                    <option key={item.id} value={index}>
                      {index + 1}번 · 문제 {item.id}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid grid-cols-[210px_1fr] gap-5 p-5">
              <div className="rounded-lg border border-gray-200 bg-white p-3">
                <img
                  src={getProblemImageUrl(problem.problemImage)}
                  alt={`${problem.id}번 문제`}
                  className="h-auto max-h-72 w-full object-contain"
                />
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-600">
                  <span className="rounded-full bg-gray-100 px-2 py-1 font-semibold">
                    {difficultyMap[problem.difficulty]}
                  </span>
                  <span className="rounded-full bg-gray-100 px-2 py-1 font-semibold">
                    {problemMap[problem.type]}
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <label className="block text-sm font-semibold text-gray-700">
                  배점
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={problem.score}
                      onChange={(event) => setTestPapersScore(Number(event.target.value))}
                      className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-right outline-none focus:border-gray-700"
                    />
                    <span className="text-sm text-gray-500">점</span>
                  </div>
                </label>

                <label className="block text-sm font-semibold text-gray-700">
                  다음 문항까지 공백
                  <div className="mt-2 flex items-center gap-3">
                    <input
                      type="range"
                      min={0}
                      max={PDF_MAX_GAP}
                      step={4}
                      value={problem.pdfGapAfter}
                      onChange={(event) => setTestPapersGap(Number(event.target.value))}
                      className="w-full accent-gray-900"
                    />
                    <span className="w-14 text-right text-sm text-gray-600">
                      {problem.pdfGapAfter}pt
                    </span>
                  </div>
                  <span className="mt-2 block text-xs font-normal text-gray-500">
                    공간이 부족하면 다음 문항은 자동으로 다음 열이나 페이지로 이동합니다.
                  </span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 px-5 py-4">
              <button
                type="button"
                onClick={() => removeTestPaper(selectedIndex)}
                className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                이 문항 제외
              </button>
              <button
                type="button"
                onClick={rebalanceScores}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              >
                100점 자동 배분
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
            총점 <strong>{testPapers.reduce((sum, item) => sum + item.score, 0)}점</strong>
            <span className="mx-2 text-gray-300">·</span>
            답안 입력은 시험 시작 15분 후 활성화
          </div>

          {message && (
            <div role="status" className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {message}
            </div>
          )}

          <button
            type="button"
            onClick={createAndDownloadPdf}
            disabled={isGenerating}
            className="w-full rounded-lg bg-gray-900 px-5 py-4 text-base font-bold text-white hover:bg-gray-700 disabled:cursor-wait disabled:bg-gray-400"
          >
            {isGenerating
              ? "PDF 생성 중..."
              : createdAssessmentId
                ? "같은 시험지 PDF 다시 다운로드"
                : "시험지 등록 후 PDF 생성·다운로드"}
          </button>
          {createdAssessmentId && (
            <p className="text-center text-xs text-gray-500">
              생성된 시험지 ID: {createdAssessmentId}
            </p>
          )}
        </section>

        <AssessmentPdfPreview
          title={title}
          items={testPapers}
          columnCount={columnCount}
          selectedIndex={selectedIndex}
          onSelectItem={setSelectedIndex}
          onReorder={reorderTestPaper}
        />
      </div>
    </div>
  );
}

export default EnrollTestPapersPageThree;
