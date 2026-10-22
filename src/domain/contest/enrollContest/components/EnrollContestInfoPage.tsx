import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { difficultyMap, problemMap } from "../../../problem/utils/problemMap";
import { getProblemImageUrl } from "../../../testPaper/enrollTestPapers/services/problemImage";
import { enrollContest } from "../apis/contest";
import { useContestStore } from "../hooks/useContestStore";
import { validateContestDraft } from "../services/contestDraft";

const inputClassName =
  "mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 font-normal outline-none focus:border-gray-700";

function EnrollContestInfoPage({ onBack }: { onBack: () => void }) {
  const {
    contestProblems,
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
    rebalanceScores,
    reset,
  } = useContestStore();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const totalScore = contestProblems.reduce((sum, problem) => sum + problem.score, 0);

  const submit = async () => {
    const draft = { title, minutes, startAt, endAt, problems: contestProblems };
    const validationMessage = validateContestDraft(draft);
    if (validationMessage) {
      setMessage(validationMessage);
      return;
    }
    setIsSubmitting(true);
    setMessage(null);
    try {
      await enrollContest(draft);
      alert("경시대회를 등록했습니다.");
      reset();
      navigate({ to: "/contests" });
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "경시대회를 등록하지 못했습니다."
      );
    } finally {
      setIsSubmitting(false);
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
          대회 정보를 입력하고 문항 순서와 배점을 확인하세요.
        </p>
      </div>

      <div className="grid grid-cols-[420px_1fr] items-start gap-10">
        <section className="sticky top-4 space-y-5 rounded-xl border border-gray-300 bg-white p-6">
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

          <div className="flex items-center justify-between border-t border-gray-200 pt-5">
            <p className={`text-sm font-bold ${totalScore === 100 ? "text-gray-900" : "text-red-600"}`}>
              총점 {totalScore}점 / 100점
            </p>
            <button
              type="button"
              onClick={rebalanceScores}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
            >
              균등 배분
            </button>
          </div>

          {message && <p className="text-sm text-red-600">{message}</p>}

          <button
            type="button"
            onClick={submit}
            disabled={isSubmitting}
            className="w-full rounded-lg bg-gray-900 px-6 py-3 font-bold text-white hover:bg-gray-700 disabled:bg-gray-400"
          >
            {isSubmitting ? "등록 중..." : "경시대회 등록"}
          </button>
        </section>

        <section>
          {contestProblems.length === 0 ? (
            <div className="rounded-xl border border-gray-300 p-10 text-center text-gray-600">
              선택한 문항이 없습니다.
            </div>
          ) : (
            <ol className="space-y-4">
              {contestProblems.map((problem, index) => (
                <li
                  key={problem.id}
                  className="flex items-start gap-5 rounded-xl border border-gray-300 bg-white p-4"
                >
                  <div className="w-36 shrink-0">
                    <p className="text-lg font-bold text-gray-900">{index + 1}번</p>
                    <p className="text-xs text-gray-500">
                      문제 {problem.id} · {difficultyMap[problem.difficulty]} ·{" "}
                      {problemMap[problem.type]}
                    </p>
                    <label className="mt-3 block text-xs font-semibold text-gray-600">
                      배점
                      <input
                        type="number"
                        min={1}
                        value={problem.score}
                        onChange={(event) =>
                          setProblemScore(index, Number(event.target.value))
                        }
                        className="mt-1 block w-24 rounded-lg border border-gray-300 px-3 py-1 text-right text-sm"
                      />
                    </label>
                  </div>
                  <img
                    src={getProblemImageUrl(problem.problemImage)}
                    alt={`${problem.id}번 문제`}
                    className="max-h-56 min-w-0 flex-1 object-contain object-left"
                    loading="lazy"
                  />
                  <div className="flex shrink-0 flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => moveProblem(index, index - 1)}
                      disabled={index === 0}
                      aria-label={`${index + 1}번 문항 위로`}
                      className="rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 disabled:opacity-30"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => moveProblem(index, index + 1)}
                      disabled={index === contestProblems.length - 1}
                      aria-label={`${index + 1}번 문항 아래로`}
                      className="rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 disabled:opacity-30"
                    >
                      ▼
                    </button>
                    <button
                      type="button"
                      onClick={() => removeProblem(index)}
                      className="rounded-lg border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                    >
                      삭제
                    </button>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </div>
  );
}

export default EnrollContestInfoPage;
