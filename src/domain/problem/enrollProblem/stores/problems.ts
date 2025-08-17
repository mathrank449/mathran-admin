import { create } from "zustand";
import type { ProblemResponse } from "../../types/problem";

type ProblemStore = {
  problems: ProblemResponse[]; // 상태로 문제 배열
  selectedProblem: ProblemResponse | undefined;
  setProblems: (problems: ProblemResponse[]) => void; // 문제 배열 업데이트
  setSelectedProblem: (problem: ProblemResponse | undefined) => void; // 선택 문제 설정
  clearProblems: () => void; // 문제 배열 초기화
};

export const useProblemStore = create<ProblemStore>((set) => ({
  problems: [],
  selectedProblem: undefined,
  setProblems: (problems) => set({ problems }),
  setSelectedProblem: (selectedProblem) => set({ selectedProblem }),
  clearProblems: () => set({ problems: [] }),
}));
