import type { DifficultyKoreaType, DifficultyType } from "../types/problem";

export const difficultyToKorean = (
  difficulty: DifficultyType
): DifficultyKoreaType => {
  switch (difficulty) {
    case "LOW":
      return "하";
    case "MID_LOW":
      return "중하";
    case "MID":
      return "중";
    case "MID_HIGH":
      return "중상";
    case "HIGH":
      return "상";
    case "KILLER":
      return "킬러";
    default:
      throw new Error(`Invalid difficulty: ${difficulty}`);
  }
};

export const koreanToDifficulty = (
  difficulty: DifficultyKoreaType
): DifficultyType => {
  switch (difficulty) {
    case "하":
      return "LOW";
    case "중하":
      return "MID_LOW";
    case "중":
      return "MID";
    case "중상":
      return "MID_HIGH";
    case "상":
      return "HIGH";
    case "킬러":
      return "KILLER";
    default:
      throw new Error(`Invalid difficulty: ${difficulty}`);
  }
};
