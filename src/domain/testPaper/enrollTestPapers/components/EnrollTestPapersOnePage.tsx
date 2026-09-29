import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import UnitSelectionByGrade from "../../../problem/components/UnitSelectionByGrade";
import type {
  DifficultyType,
  ProblemResponse,
  ProblemType,
  QueryListType,
} from "../../../problem/types/problem";
import { useTestPapersStore } from "../hooks/useTestPapers";
import { loadImageAspectRatio } from "../services/problemImage";
import {
  selectedCourseRoots,
  type CourseSelectionRules,
} from "../services/courseSelection";
import { getProblemPageByCourseRules } from "../services/courseProblemSearch";
import {
  selectRandomProblems,
  type DifficultyCounts,
} from "../services/randomProblemSelection";
import { loadRandomProblemCandidates } from "../services/randomProblemLoader";
import EnrollTestPapersPageTwo from "./EnrollTestPapersPageTwo";

const difficultyOptions: { value: DifficultyType; label: string }[] = [
  { value: "", label: "전체 난이도" },
  { value: "LOW", label: "하" },
  { value: "MID_LOW", label: "중하" },
  { value: "MID", label: "중" },
  { value: "MID_HIGH", label: "중상" },
  { value: "HIGH", label: "상" },
  { value: "KILLER", label: "킬러" },
];

const answerTypeOptions: { value: ProblemType; label: string }[] = [
  { value: "", label: "전체 유형" },
  { value: "MULTIPLE_CHOICE", label: "객관식" },
  { value: "SHORT_ANSWER", label: "주관식" },
];

const emptyQuery: QueryListType = {
  problemId: "",
  difficulty: "",
  answerType: "",
  coursePath: "",
  location: "",
  year: "",
  pastProblem: "",
};

function EnrollTestPapersOnePage({ onContinue }: { onContinue: () => void }) {
  const testPapers = useTestPapersStore((state) => state.testPapers);
  const insertTestPapers = useTestPapersStore((state) => state.insertTestPapers);
  const removeTestPaper = useTestPapersStore((state) => state.removeTestPaper);
  const [filters, setFilters] = useState<QueryListType>(emptyQuery);
  const [appliedFilters, setAppliedFilters] = useState<QueryListType>(emptyQuery);
  const [page, setPage] = useState(1);
  const [problems, setProblems] = useState<ProblemResponse[]>([]);
  const [selectingId, setSelectingId] = useState<string | null>(null);
  const [showCourseFilter, setShowCourseFilter] = useState(false);
  const [selectionRules, setSelectionRules] = useState<CourseSelectionRules>({});
  const [appliedSelectionRules, setAppliedSelectionRules] =
    useState<CourseSelectionRules>({});
  const [difficultyCounts, setDifficultyCounts] = useState<DifficultyCounts>({
    low: 5,
    middle: 10,
    high: 5,
  });
  const [isAutoSelecting, setIsAutoSelecting] = useState(false);
  const [autoSelectionMessage, setAutoSelectionMessage] = useState<string | null>(null);

  const { data, isFetching, error } = useQuery({
    queryKey: [
      "assessment-problem-picker",
      appliedFilters,
      appliedSelectionRules,
      page,
    ],
    queryFn: () =>
      getProblemPageByCourseRules(
        appliedFilters,
        appliedSelectionRules,
        page,
        12
      ),
  });

  useEffect(() => {
    if (!data) return;
    setProblems((current) => {
      const combined = page === 1 ? data.queryResults : [...current, ...data.queryResults];
      return Array.from(new Map(combined.map((problem) => [problem.id, problem])).values());
    });
  }, [data, page]);

  const selectedIds = useMemo(
    () => new Set(testPapers.map((problem) => problem.id)),
    [testPapers]
  );
  const nextPage = data?.possibleNextPageNumbers.find(
    (candidate) => candidate > data.currentPageNumber
  );

  const addProblem = async (problem: ProblemResponse) => {
    if (testPapers.length >= 50) {
      alert("한 시험지에는 최대 50문항까지 넣을 수 있습니다.");
      return;
    }
    setSelectingId(problem.id);
    try {
      insertTestPapers({
        ...problem,
        score: 0,
        pdfGapAfter: 16,
        imageAspectRatio: await loadImageAspectRatio(problem.problemImage),
      });
    } catch (imageError) {
      alert(
        imageError instanceof Error
          ? imageError.message
          : "문제 이미지를 불러오지 못했습니다."
      );
    } finally {
      setSelectingId(null);
    }
  };

  const toggleProblem = async (problem: ProblemResponse) => {
    const selectedIndex = testPapers.findIndex((item) => item.id === problem.id);
    if (selectedIndex !== -1) {
      removeTestPaper(selectedIndex);
      return;
    }
    await addProblem(problem);
  };

  const applyFilters = () => {
    setProblems([]);
    setPage(1);
    setAppliedFilters({
      ...filters,
      coursePath: "",
    });
    setAppliedSelectionRules({ ...selectionRules });
  };

  const autoSelectByDifficulty = async () => {
    const requested =
      difficultyCounts.low + difficultyCounts.middle + difficultyCounts.high;
    if (requested <= 0) {
      setAutoSelectionMessage("난이도별 문항 수를 한 개 이상 입력해주세요.");
      return;
    }
    if (testPapers.length + requested > 50) {
      setAutoSelectionMessage("기존 선택을 포함해 최대 50문항까지 구성할 수 있습니다.");
      return;
    }
    setIsAutoSelecting(true);
    setAutoSelectionMessage("조건에 맞는 문제를 조회하고 있습니다.");
    try {
      const candidates = await loadRandomProblemCandidates(
        { ...filters, problemId: "", difficulty: "", coursePath: "" },
        selectionRules
      );
      const chosen = selectRandomProblems(
        candidates.filter((problem) => !selectedIds.has(problem.id)),
        difficultyCounts
      );
      const prepared = await Promise.all(
        chosen.map(async (problem) => ({
          ...problem,
          score: 0,
          pdfGapAfter: 16,
          imageAspectRatio: await loadImageAspectRatio(problem.problemImage),
        }))
      );
      prepared.forEach(insertTestPapers);
      setAutoSelectionMessage(`${prepared.length}개 문항을 무작위로 추가했습니다.`);
    } catch (selectionError) {
      setAutoSelectionMessage(
        selectionError instanceof Error
          ? selectionError.message
          : "무작위 출제에 실패했습니다."
      );
    } finally {
      setIsAutoSelecting(false);
    }
  };

  return (
    <section>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          applyFilters();
        }}
        className="rounded-xl border border-gray-300 bg-white p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">문항 선택</h2>
            <p className="mt-1 text-sm text-gray-500">
              조건을 바꾸면서 문제 이미지를 확인하고 여러 문항을 선택하세요.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowCourseFilter((visible) => !visible)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
          >
            {showCourseFilter ? "단원 선택 닫기" : "단원 선택"}
          </button>
        </div>

        <div className="mt-6 grid grid-cols-5 gap-3">
          <input
            type="number"
            min={1}
            value={filters.problemId ?? ""}
            onChange={(event) => setFilters({ ...filters, problemId: event.target.value })}
            placeholder="문제 ID"
            className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-700"
          />
          <select
            value={filters.difficulty}
            onChange={(event) =>
              setFilters({ ...filters, difficulty: event.target.value as DifficultyType })
            }
            className="rounded-lg border border-gray-300 px-3 py-2"
          >
            {difficultyOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <select
            value={filters.answerType}
            onChange={(event) =>
              setFilters({ ...filters, answerType: event.target.value as ProblemType })
            }
            className="rounded-lg border border-gray-300 px-3 py-2"
          >
            {answerTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <input
            type="number"
            value={filters.year}
            onChange={(event) => setFilters({ ...filters, year: event.target.value })}
            placeholder="출제 연도"
            className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-700"
          />
          <input
            type="text"
            value={filters.location}
            onChange={(event) => setFilters({ ...filters, location: event.target.value })}
            placeholder="지역"
            className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-700"
          />
        </div>

        {showCourseFilter && (
          <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-5">
            <UnitSelectionByGrade
              selectionRules={selectionRules}
              onSelectionRulesChange={setSelectionRules}
            />
          </div>
        )}

        <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-5">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-bold text-gray-900">난이도별 무작위 출제</p>
              <p className="mt-1 text-xs text-gray-500">
                현재 검색 조건과 선택 단원 안에서 중복 없이 문제를 추가합니다.
              </p>
            </div>
            <div className="flex items-end gap-3">
              {(
                [
                  ["low", "하"],
                  ["middle", "중"],
                  ["high", "상"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="text-xs font-semibold text-gray-600">
                  {label}
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={difficultyCounts[key]}
                    onChange={(event) =>
                      setDifficultyCounts({
                        ...difficultyCounts,
                        [key]: Math.max(0, Number(event.target.value)),
                      })
                    }
                    className="mt-1 block w-20 rounded-lg border border-gray-300 bg-white px-3 py-2 text-right text-sm"
                  />
                </label>
              ))}
              <button
                type="button"
                onClick={autoSelectByDifficulty}
                disabled={isAutoSelecting}
                className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-gray-700 disabled:bg-gray-400"
              >
                {isAutoSelecting ? "구성 중..." : "조건대로 추가"}
              </button>
            </div>
          </div>
          {autoSelectionMessage && (
            <p className="mt-3 text-xs text-gray-700">{autoSelectionMessage}</p>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-5">
          <p className="text-sm text-gray-600">
            선택 {testPapers.length}개
            {selectedCourseRoots(selectionRules).length > 0
              ? ` · 선택 범위 ${selectedCourseRoots(selectionRules).length}개`
              : " · 전체 단원"}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setFilters(emptyQuery);
                setSelectionRules({});
                setAppliedSelectionRules({});
                setProblems([]);
                setPage(1);
                setAppliedFilters(emptyQuery);
              }}
              className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
            >
              조건 초기화
            </button>
            <button
              type="submit"
              className="rounded-lg bg-gray-900 px-6 py-2 text-sm font-semibold text-white hover:bg-gray-700"
            >
              검색
            </button>
          </div>
        </div>
      </form>

      <div className="mt-8">
        <EnrollTestPapersPageTwo
          problems={problems}
          selectedIds={selectedIds}
          selectingId={selectingId}
          onToggle={toggleProblem}
        />
        {error && (
          <p className="mt-6 text-center text-sm text-red-600">
            문제 목록을 불러오지 못했습니다.
          </p>
        )}
        {isFetching && (
          <p className="mt-6 text-center text-sm text-gray-500">문제를 불러오는 중입니다.</p>
        )}
        {!isFetching && nextPage !== undefined && (
          <button
            type="button"
            onClick={() => setPage(nextPage)}
            className="mx-auto mt-8 block rounded-lg border border-gray-300 bg-white px-8 py-3 font-semibold text-gray-700 hover:bg-gray-100"
          >
            문제 더 보기
          </button>
        )}
      </div>

      <div className="sticky bottom-4 z-10 mt-8 flex items-center justify-between rounded-xl border border-gray-300 bg-white/95 px-6 py-4 shadow-lg backdrop-blur">
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
      </div>
    </section>
  );
}

export default EnrollTestPapersOnePage;
