import { create } from "zustand";
import type { AssessmentPdfProblem } from "../../../testPaper/enrollTestPapers/types/assessmentPdf";
import {
  PDF_MAX_GAP,
  type PdfMaxPerPage,
} from "../../../testPaper/enrollTestPapers/services/pdfLayoutPlanner";
import { distributeScores } from "../../../testPaper/enrollTestPapers/services/scoreDistribution";
import { CONTEST_MAX_PROBLEMS, defaultContestPeriod } from "../services/contestDraft";

type ContestStore = {
  contestProblems: AssessmentPdfProblem[];
  /** PDF 편집 화면에서 고른 문항 */
  selectedIndex: number;
  columnCount: 1 | 2;
  maxPerPage: PdfMaxPerPage;
  /** 지금 내용으로 이미 등록했는지. 내용을 바꾸면 false가 되어 다시 등록한다. */
  registered: boolean;
  title: string;
  minutes: number;
  /** datetime-local 값 (YYYY-MM-DDTHH:mm) */
  startAt: string;
  endAt: string;

  setTitle: (title: string) => void;
  setMinutes: (minutes: number) => void;
  setStartAt: (startAt: string) => void;
  setEndAt: (endAt: string) => void;
  setSelectedIndex: (index: number) => void;
  setColumnCount: (columnCount: 1 | 2) => void;
  setMaxPerPage: (maxPerPage: PdfMaxPerPage) => void;
  setRegistered: (registered: boolean) => void;

  insertProblem: (problem: AssessmentPdfProblem) => void;
  removeProblem: (index: number) => void;
  moveProblem: (fromIndex: number, toIndex: number) => void;
  setProblemScore: (index: number, score: number) => void;
  setProblemGap: (index: number, gapAfter: number) => void;
  setAllProblemsGap: (gapAfter: number) => void;
  rebalanceScores: () => void;
  reset: () => void;
};

const initialState = () => ({
  contestProblems: [] as AssessmentPdfProblem[],
  selectedIndex: 0,
  columnCount: 1 as 1 | 2,
  maxPerPage: null as PdfMaxPerPage,
  registered: false,
  title: "",
  minutes: 60,
  ...defaultContestPeriod(),
});

export const useContestStore = create<ContestStore>((set) => ({
  ...initialState(),

  setTitle: (title) => set({ title, registered: false }),
  setMinutes: (minutes) => set({ minutes, registered: false }),
  setStartAt: (startAt) => set({ startAt, registered: false }),
  setEndAt: (endAt) => set({ endAt, registered: false }),
  setSelectedIndex: (index) =>
    set((state) => ({
      selectedIndex: Math.max(0, Math.min(index, state.contestProblems.length - 1)),
    })),
  setColumnCount: (columnCount) => set({ columnCount }),
  setMaxPerPage: (maxPerPage) => set({ maxPerPage }),
  setRegistered: (registered) => set({ registered }),

  insertProblem: (problem) =>
    set((state) => {
      if (
        state.contestProblems.length >= CONTEST_MAX_PROBLEMS ||
        state.contestProblems.some((item) => item.id === problem.id)
      ) {
        return state;
      }
      const contestProblems = distributeScores([...state.contestProblems, problem]);
      return {
        contestProblems,
        selectedIndex: contestProblems.length - 1,
        registered: false,
      };
    }),

  removeProblem: (index) =>
    set((state) => {
      if (index < 0 || index >= state.contestProblems.length) return state;
      const contestProblems = distributeScores(
        state.contestProblems.filter((_, itemIndex) => itemIndex !== index)
      );
      return {
        contestProblems,
        selectedIndex: Math.max(
          0,
          Math.min(state.selectedIndex, contestProblems.length - 1)
        ),
        registered: false,
      };
    }),

  moveProblem: (fromIndex, toIndex) =>
    set((state) => {
      const length = state.contestProblems.length;
      if (
        fromIndex === toIndex ||
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= length ||
        toIndex >= length
      ) {
        return state;
      }
      const contestProblems = [...state.contestProblems];
      const [moved] = contestProblems.splice(fromIndex, 1);
      contestProblems.splice(toIndex, 0, moved);
      return { contestProblems, selectedIndex: toIndex, registered: false };
    }),

  setProblemScore: (index, score) =>
    set((state) => {
      const target = state.contestProblems[index];
      if (!target) return state;
      const contestProblems = [...state.contestProblems];
      contestProblems[index] = { ...target, score };
      return { contestProblems, registered: false };
    }),

  setProblemGap: (index, gapAfter) =>
    set((state) => {
      const target = state.contestProblems[index];
      if (!target) return state;
      const contestProblems = [...state.contestProblems];
      contestProblems[index] = {
        ...target,
        pdfGapAfter: Math.max(0, Math.min(PDF_MAX_GAP, gapAfter)),
      };
      return { contestProblems };
    }),

  setAllProblemsGap: (gapAfter) =>
    set((state) => ({
      contestProblems: state.contestProblems.map((problem) => ({
        ...problem,
        pdfGapAfter: Math.max(0, Math.min(PDF_MAX_GAP, gapAfter)),
      })),
    })),

  rebalanceScores: () =>
    set((state) => ({
      contestProblems: distributeScores(state.contestProblems),
      registered: false,
    })),

  reset: () => set(initialState()),
}));
