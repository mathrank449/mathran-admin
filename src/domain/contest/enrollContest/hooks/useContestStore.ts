import { create } from "zustand";
import type {
  ProblemResponse,
  ScoreProblemResponse,
} from "../../../problem/types/problem";

type ContestStore = {
  problems: ProblemResponse[][]; // 대회별 선택가능한 문제 배열
  contestProblems: (ScoreProblemResponse | undefined)[]; // 대회 문제 배열
  title: string;
  time: number;
  startDate: string | undefined; // ISO 문자열
  endDate: string | undefined; // ISO 문자열
  selectedIndex: number;

  // setters

  setTitle: (title: string) => void;
  setTime: (time: number) => void;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  setSelectedIndex: (index: number) => void;

  // contest 조작
  addContestProblem: () => void;
  removeSelectedContestProblem: () => void;
  clearSelectedContestProblem: () => void;

  // 현재 선택된 대회 선택 가능한 문제 조작
  insertProblems: (problem: ProblemResponse[]) => void; // selectedIndex의 문제집에 문제 리스트 삽입
  clearProblems: () => void; // selectedIndex의 문제집에 문제 초기화
  insertContestProblem: (problem: ScoreProblemResponse) => void; // selectedIndex의 문제집에 문제 삽입
  setContestProblemScore: (socore: number) => void; // selectedIndex의 문제집에 문제 삽입
};

export const useContestStore = create<ContestStore>((set) => ({
  problems: [[]],
  contestProblems: [undefined],
  title: "",
  time: 20,
  startDate: undefined,
  endDate: undefined,
  selectedIndex: 0,

  setTitle: (title) => set({ title }),
  setTime: (time) => set({ time }),
  setStartDate: (date) => set({ startDate: date }),
  setEndDate: (date) => set({ endDate: date }),
  setSelectedIndex: (index) => set({ selectedIndex: index }),

  addContestProblem: () =>
    set((state) => ({
      problems: [...state.problems, []],
      contestProblems: [...state.contestProblems, undefined],
    })),

  removeSelectedContestProblem: () =>
    set((state) => {
      if (state.selectedIndex === 0) return state;
      const newContestProblems = state.contestProblems.filter(
        (_, i) => i !== state.selectedIndex
      );
      const newProblems = state.problems.filter(
        (_, i) => i !== state.selectedIndex
      );
      const newIndex = Math.max(0, state.selectedIndex - 1);
      return {
        problems: newProblems,
        contestProblems: newContestProblems,
        selectedIndex: newIndex,
      };
    }),

  clearSelectedContestProblem: () =>
    set((state) => {
      const newContestProblems = [...state.contestProblems];
      newContestProblems[state.selectedIndex] = undefined;
      return { contestProblems: newContestProblems };
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

  insertContestProblem: (problem) =>
    set((state) => {
      const newContestProblems = [...state.contestProblems];
      newContestProblems[state.selectedIndex] = problem;
      return { contestProblems: newContestProblems };
    }),

  setContestProblemScore: (score) =>
    set((state) => {
      const newContestProblems = [...state.contestProblems];
      const target = newContestProblems[state.selectedIndex];

      if (!target) {
        return state;
      }

      target.score = score; // 여기서는 target이 항상 존재
      return { contestProblems: newContestProblems };
    }),
}));
