import { create } from "zustand";
import type {
  ProblemResponse,
  TestPaerProblemResponse,
} from "../../../problem/types/problem";

type TestPapersStore = {
  problems: ProblemResponse[][]; // 문제집별 문제 배열
  testPapers: (TestPaerProblemResponse | undefined)[]; // 문제집 배열
  title: string;
  time: number;
  selectedIndex: number;

  // setters
  setSelectedIndex: (index: number) => void;
  setTitle: (title: string) => void;
  setTime: (time: number) => void;

  // testPaper 조작
  addTestPaper: () => void;
  removeSelectedTestPaper: () => void;
  clearSelectedTestPaper: () => void;

  // 현재 선택된 문제집 문제 조작
  insertProblems: (problem: ProblemResponse[]) => void; // selectedIndex의 문제집에 문제 리스트 삽입
  clearProblems: () => void; // selectedIndex의 문제집에 문제 리스트 삽입
  insertTestPapers: (problem: TestPaerProblemResponse) => void; // selectedIndex의 문제집에 문제 삽입
  setTestPapersScore: (socore: number) => void; // selectedIndex의 문제집에 문제 삽입
};

export const useTestPapersStore = create<TestPapersStore>((set) => ({
  problems: [[]],
  testPapers: [undefined],
  selectedIndex: 0,
  title: "",
  time: 20,

  setSelectedIndex: (index) => set({ selectedIndex: index }),
  setTitle: (title) => set({ title }),
  setTime: (time) => set({ time }),

  addTestPaper: () =>
    set((state) => ({
      testPapers: [...state.testPapers, undefined],
      problems: [...state.problems, []],
    })),

  removeSelectedTestPaper: () =>
    set((state) => {
      if (state.selectedIndex === 0) return state;
      const newTestPapers = state.testPapers.filter(
        (_, i) => i !== state.selectedIndex
      );
      const newProblems = state.problems.filter(
        (_, i) => i !== state.selectedIndex
      );
      const newIndex = Math.max(0, state.selectedIndex - 1);
      return {
        testPapers: newTestPapers,
        problems: newProblems,
        selectedIndex: newIndex,
      };
    }),

  clearSelectedTestPaper: () =>
    set((state) => {
      const newTestPapers = [...state.testPapers];
      newTestPapers[state.selectedIndex] = undefined;
      return { testPapers: newTestPapers };
    }),

  insertProblems: (problems) =>
    set((state) => {
      const newProblems = [...state.problems];
      newProblems[state.selectedIndex] = problems;
      return { problems: newProblems };
    }),

  clearProblems: () =>
    set((state) => {
      const newProblems = [...state.problems];
      newProblems[state.selectedIndex] = [];
      return { problems: newProblems };
    }),

  insertTestPapers: (problem) =>
    set((state) => {
      const newTestPapers = [...state.testPapers];
      newTestPapers[state.selectedIndex] = problem;
      return { testPapers: newTestPapers };
    }),

  setTestPapersScore: (score) =>
    set((state) => {
      const newTestPapers = [...state.testPapers];
      const target = newTestPapers[state.selectedIndex];

      if (!target) {
        return state;
      }

      target.score = score; // 여기서는 target이 항상 존재
      return { testPapers: newTestPapers };
    }),
}));
