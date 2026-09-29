import type {
  DifficultyType,
  ProblemResponse,
} from "../../../problem/types/problem";

export interface DifficultyCounts {
  low: number;
  middle: number;
  high: number;
}

const difficultyGroups: Record<keyof DifficultyCounts, DifficultyType[]> = {
  low: ["LOW", "MID_LOW"],
  middle: ["MID", "MID_HIGH"],
  high: ["HIGH", "KILLER"],
};

export const selectRandomProblems = (
  candidates: ProblemResponse[],
  counts: DifficultyCounts,
  random: () => number = Math.random
) => {
  const selected: ProblemResponse[] = [];
  for (const group of Object.keys(difficultyGroups) as (keyof DifficultyCounts)[]) {
    const pool = candidates.filter((problem) =>
      difficultyGroups[group].includes(problem.difficulty)
    );
    if (pool.length < counts[group]) {
      throw new Error(
        `${group === "low" ? "하" : group === "middle" ? "중" : "상"} 난이도 문제는 ${counts[group]}개가 필요하지만 ${pool.length}개만 조회되었습니다.`
      );
    }
    const shuffled = [...pool];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const target = Math.floor(random() * (index + 1));
      [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
    }
    selected.push(...shuffled.slice(0, counts[group]));
  }
  return Array.from(new Map(selected.map((problem) => [problem.id, problem])).values());
};

export const randomSelectionDifficulties = Object.values(difficultyGroups).flat();
