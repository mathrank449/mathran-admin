import type { DifficultyType, ProblemType } from "../types/problem";

export const difficultyMap: Record<DifficultyType, string> = {
  "": "전체",
  LOW: "하",
  MID_LOW: "중하",
  MID: "중",
  MID_HIGH: "중상",
  HIGH: "상",
  KILLER: "칼러",
};

export const problemMap: Record<ProblemType, string> = {
  "": "전체",
  MULTIPLE_CHOICE: "객관식",
  SHORT_ANSWER: "단답형",
};

export const koreanDifficultyMap: Record<string, DifficultyType> = {
  전체: "",
  하: "LOW",
  중하: "MID_LOW",
  중: "MID",
  중상: "MID_HIGH",
  상: "HIGH",
  칼러: "KILLER",
};

export const koreanProblemMap: Record<string, ProblemType> = {
  전체: "",
  객관식: "MULTIPLE_CHOICE",
  단답형: "SHORT_ANSWER",
};
