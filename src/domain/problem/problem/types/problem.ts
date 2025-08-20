import type { DifficultyType, ProblemType } from "../../types/problem";

export type ProblemItemResponse = {
  id: string;
  problemId: string;
  title: string;
  problemImage: string;
  coursePath: string;
  answerType: ProblemType;
  difficulty: DifficultyType;
  firstTrySuccessCount: number;
  totalAttemptedCount: number;
  attemptedUserDistinctCount: number;
  accuracy: number;
};

export type SingleProblemQueryListType = {
  singleProblemId: string;
  coursePath: string;
  answerType: ProblemType;
  difficulty: DifficultyType;
};
