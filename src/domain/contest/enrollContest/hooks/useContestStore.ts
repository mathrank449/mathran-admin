import { create } from "zustand";
import type { ScoreProblemResponse } from "../../../problem/types/problem";
import { distributeScores } from "../../../testPaper/enrollTestPapers/services/scoreDistribution";
import { CONTEST_MAX_PROBLEMS, defaultContestPeriod } from "../services/contestDraft";

type ContestStore = {
  contestProblems: ScoreProblemResponse[];
  title: string;
  minutes: number;
  /** datetime-local 값 (YYYY-MM-DDTHH:mm) */
  startAt: string;
  endAt: string;

  setTitle: (title: string) => void;
  setMinutes: (minutes: number) => void;
  setStartAt: (startAt: string) => void;
  setEndAt: (endAt: string) => void;

  insertProblem: (problem: ScoreProblemResponse) => void;
  removeProblem: (index: number) => void;
  moveProblem: (fromIndex: number, toIndex: number) => void;
  setProblemScore: (index: number, score: number) => void;
  rebalanceScores: () => void;
  reset: () => void;
};

const initialState = () => ({
  contestProblems: [] as ScoreProblemResponse[],
  title: "",
  minutes: 60,
  ...defaultContestPeriod(),
});

export const useContestStore = create<ContestStore>((set) => ({
  ...initialState(),

  setTitle: (title) => set({ title }),
  setMinutes: (minutes) => set({ minutes }),
  setStartAt: (startAt) => set({ startAt }),
  setEndAt: (endAt) => set({ endAt }),

  insertProblem: (problem) =>
    set((state) => {
      if (
        state.contestProblems.length >= CONTEST_MAX_PROBLEMS ||
        state.contestProblems.some((item) => item.id === problem.id)
      ) {
        return state;
      }
      return { contestProblems: distributeScores([...state.contestProblems, problem]) };
    }),

  removeProblem: (index) =>
    set((state) => {
      if (index < 0 || index >= state.contestProblems.length) return state;
      return {
        contestProblems: distributeScores(
          state.contestProblems.filter((_, itemIndex) => itemIndex !== index)
        ),
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
      return { contestProblems };
    }),

  setProblemScore: (index, score) =>
    set((state) => {
      const target = state.contestProblems[index];
      if (!target) return state;
      const contestProblems = [...state.contestProblems];
      contestProblems[index] = { ...target, score };
      return { contestProblems };
    }),

  rebalanceScores: () =>
    set((state) => ({ contestProblems: distributeScores(state.contestProblems) })),

  reset: () => set(initialState()),
}));
