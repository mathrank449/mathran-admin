import { create } from "zustand";
import type { AssessmentPdfProblem } from "../types/assessmentPdf";
import { PDF_MAX_GAP } from "../services/pdfLayoutPlanner";

type TestPapersStore = {
  testPapers: AssessmentPdfProblem[];
  title: string;
  time: number;
  selectedIndex: number;
  columnCount: 1 | 2;
  createdAssessmentId: string | null;

  // setters
  setSelectedIndex: (index: number) => void;
  setTitle: (title: string) => void;
  setTime: (time: number) => void;
  setColumnCount: (columnCount: 1 | 2) => void;
  setCreatedAssessmentId: (assessmentId: string | null) => void;

  insertTestPapers: (problem: AssessmentPdfProblem) => void;
  removeTestPaper: (index: number) => void;
  reorderTestPaper: (fromIndex: number, toIndex: number) => void;
  setTestPapersScore: (score: number) => void;
  setTestPapersGap: (gapAfter: number) => void;
  setAllTestPapersGap: (gapAfter: number) => void;
  rebalanceScores: () => void;
};

const rebalance = (items: AssessmentPdfProblem[]) => {
  if (items.length === 0) return items;
  const quotient = Math.floor(100 / items.length);
  return items.map((item, index) => ({
    ...item,
    score: quotient + (index < 100 % items.length ? 1 : 0),
  }));
};

export const useTestPapersStore = create<TestPapersStore>((set) => ({
  testPapers: [],
  selectedIndex: 0,
  title: "",
  time: 20,
  columnCount: 1,
  createdAssessmentId: null,

  setSelectedIndex: (index) =>
    set((state) => ({
      selectedIndex: Math.max(0, Math.min(index, state.testPapers.length - 1)),
    })),
  setTitle: (title) => set({ title, createdAssessmentId: null }),
  setTime: (time) => set({ time, createdAssessmentId: null }),
  setColumnCount: (columnCount) =>
    set((state) => ({
      columnCount,
      testPapers: state.testPapers.map((problem) => ({ ...problem })),
    })),
  setCreatedAssessmentId: (createdAssessmentId) => set({ createdAssessmentId }),

  insertTestPapers: (problem) =>
    set((state) => {
      if (
        state.testPapers.length >= 50 ||
        state.testPapers.some((item) => item.id === problem.id)
      ) {
        return state;
      }
      const testPapers = rebalance([...state.testPapers, problem]);
      return {
        testPapers,
        selectedIndex: testPapers.length - 1,
        createdAssessmentId: null,
      };
    }),

  removeTestPaper: (index) =>
    set((state) => {
      if (index < 0 || index >= state.testPapers.length) return state;
      const testPapers = rebalance(
        state.testPapers.filter((_, itemIndex) => itemIndex !== index)
      );
      return {
        testPapers,
        selectedIndex: Math.max(0, Math.min(state.selectedIndex, testPapers.length - 1)),
        createdAssessmentId: null,
      };
    }),

  reorderTestPaper: (fromIndex, toIndex) =>
    set((state) => {
      if (
        fromIndex === toIndex ||
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= state.testPapers.length ||
        toIndex >= state.testPapers.length
      ) {
        return state;
      }
      const testPapers = [...state.testPapers];
      const [moved] = testPapers.splice(fromIndex, 1);
      testPapers.splice(toIndex, 0, moved);
      return {
        testPapers,
        selectedIndex: toIndex,
        createdAssessmentId: null,
      };
    }),

  setTestPapersScore: (score) =>
    set((state) => {
      const target = state.testPapers[state.selectedIndex];
      if (!target) return state;
      const testPapers = [...state.testPapers];
      testPapers[state.selectedIndex] = { ...target, score };
      return { testPapers, createdAssessmentId: null };
    }),

  setTestPapersGap: (gapAfter) =>
    set((state) => {
      const target = state.testPapers[state.selectedIndex];
      if (!target) return state;
      const testPapers = [...state.testPapers];
      testPapers[state.selectedIndex] = {
        ...target,
        pdfGapAfter: Math.max(0, gapAfter),
      };
      return { testPapers };
    }),

  setAllTestPapersGap: (gapAfter) =>
    set((state) => ({
      testPapers: state.testPapers.map((item) => ({
        ...item,
        pdfGapAfter: Math.max(0, Math.min(PDF_MAX_GAP, gapAfter)),
      })),
    })),

  rebalanceScores: () =>
    set((state) => {
      if (state.testPapers.length === 0) return state;
      return {
        testPapers: rebalance(state.testPapers),
        createdAssessmentId: null,
      };
    }),
}));
