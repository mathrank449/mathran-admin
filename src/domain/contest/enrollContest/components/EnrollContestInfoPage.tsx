import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { difficultyMap, problemMap } from "../../../problem/utils/problemMap";
import AssessmentPdfPreview from "../../../testPaper/enrollTestPapers/components/AssessmentPdfPreview";
import PdfLayoutControls from "../../../testPaper/enrollTestPapers/components/PdfLayoutControls";
import {
  downloadPdf,
  generateAssessmentPdf,
} from "../../../testPaper/enrollTestPapers/services/assessmentPdf";
import { PDF_MAX_GAP } from "../../../testPaper/enrollTestPapers/services/pdfLayoutPlanner";
import {
  downloadMathRankLogo,
  downloadProblemImage,
  getProblemImageUrl,
  renderTitleImage,
} from "../../../testPaper/enrollTestPapers/services/problemImage";
import { enrollContest } from "../apis/contest";
import { useContestStore } from "../hooks/useContestStore";
import { validateContestDraft } from "../services/contestDraft";

const inputClassName =
  "mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 font-normal outline-none focus:border-gray-700";

const pdfFileName = (title: string) =>
  `mathrank-contest-${title.trim().replace(/[\\/:*?"<>|\s]+/g, "_") || "untitled"}.pdf`;

function EnrollContestInfoPage({ onBack }: { onBack: () => void }) {
  const {
    contestProblems,
    selectedIndex,
    setSelectedIndex,
    columnCount,
    setColumnCount,
    maxPerPage,
    setMaxPerPage,
    registered,
    setRegistered,
    title,
    setTitle,
    minutes,
    setMinutes,
    startAt,
    setStartAt,
    endAt,
    setEndAt,
    removeProblem,
    moveProblem,
    setProblemScore,
    setProblemGap,
    setAllProblemsGap,
    rebalanceScores,
    reset,
  } = useContestStore();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const problem = contestProblems[selectedIndex];
  const totalScore = contestProblems.reduce((sum, item) => sum + item.score, 0);

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

  const registerAndDownloadPdf = async () => {
    const draft = { title, minutes, startAt, endAt, problems: contestProblems };
    const validationMessage = validateContestDraft(draft);
    if (validationMessage) {
      setMessage(validationMessage);
      return;
    }

    setIsGenerating(true);
    setMessage("문제 이미지를 내려받고 PDF를 생성하고 있습니다.");
    try {
      if (!registered) {
        await enrollContest(draft);
        setRegistered(true);
      }

      const problemImages = [];
      for (const item of contestProblems) {
        problemImages.push({ bytes: await downloadProblemImage(item.problemImage) });
      }
      const generated = await generateAssessmentPdf({
        draft: { columnCount, maxPerPage, items: contestProblems },
        // 경시대회는 앱 딥링크가 없어 QR을 넣지 않는다.
        assessmentId: null,
        logoBytes: await downloadMathRankLogo(),
        titleImageBytes: await renderTitleImage(title),
        problemImages,
      });
      downloadPdf(generated.bytes, pdfFileName(title));
      setMessage(
        `경시대회 등록과 PDF ${generated.pageCount}페이지 생성을 완료했습니다.`
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "경시대회를 등록하지 못했습니다."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const finish = () => {
    reset();
    navigate({ to: "/contests" });
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
          <label className="block text-sm font-semibold text-gray-700">
            경시대회 제목
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="예: 10월 정기 경시대회"
              className={inputClassName}
            />
          </label>
          <div className="grid grid-cols-3 gap-3">
            <label className="block text-sm font-semibold text-gray-700">
              시간 제한 (분)
              <input
                type="number"
                min={1}
                max={600}
                value={minutes}
                onChange={(event) => setMinutes(Number(event.target.value))}
                className={inputClassName}
              />
            </label>
            <label className="block text-sm font-semibold text-gray-700">
              시작 일시
              <input
                type="datetime-local"
                value={startAt}
                onChange={(event) => setStartAt(event.target.value)}
                className={inputClassName}
              />
            </label>
            <label className="block text-sm font-semibold text-gray-700">
              종료 일시
              <input
                type="datetime-local"
                value={endAt}
                onChange={(event) => setEndAt(event.target.value)}
                className={inputClassName}
              />
            </label>
          </div>

          <PdfLayoutControls
            items={contestProblems}
            onSetAllGap={setAllProblemsGap}
            columnCount={columnCount}
            onColumnCount={setColumnCount}
            maxPerPage={maxPerPage}
            onMaxPerPage={setMaxPerPage}
          />

          <div className="rounded-xl border border-gray-300">
            <div className="border-b border-gray-200 bg-gray-50 p-4">
              <label className="text-xs font-semibold text-gray-500">
                편집 문항
                <select
                  value={selectedIndex}
                  onChange={(event) => setSelectedIndex(Number(event.target.value))}
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
                >
                  {contestProblems.map((item, index) => (
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
                      onChange={(event) =>
                        setProblemScore(selectedIndex, Number(event.target.value))
                      }
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
                      onChange={(event) =>
                        setProblemGap(selectedIndex, Number(event.target.value))
                      }
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
                onClick={() => removeProblem(selectedIndex)}
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
            총점{" "}
            <strong className={totalScore === 100 ? "" : "text-red-600"}>
              {totalScore}점
            </strong>
            <span className="mx-2 text-gray-300">·</span>
            경시대회 PDF에는 QR을 넣지 않습니다.
          </div>

          {message && (
            <div
              role="status"
              className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
            >
              {message}
            </div>
          )}

          <button
            type="button"
            onClick={registerAndDownloadPdf}
            disabled={isGenerating}
            className="w-full rounded-lg bg-gray-900 px-5 py-4 text-base font-bold text-white hover:bg-gray-700 disabled:cursor-wait disabled:bg-gray-400"
          >
            {isGenerating
              ? "PDF 생성 중..."
              : registered
                ? "같은 경시대회 PDF 다시 다운로드"
                : "경시대회 등록 후 PDF 생성·다운로드"}
          </button>
          {registered && (
            <button
              type="button"
              onClick={finish}
              className="w-full rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100"
            >
              경시대회 목록으로
            </button>
          )}
        </section>

        <AssessmentPdfPreview
          title={title}
          titlePlaceholder="경시대회 제목"
          showQr={false}
          items={contestProblems}
          columnCount={columnCount}
          maxPerPage={maxPerPage}
          selectedIndex={selectedIndex}
          onSelectItem={setSelectedIndex}
          onReorder={moveProblem}
        />
      </div>
    </div>
  );
}

export default EnrollContestInfoPage;
