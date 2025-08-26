import type { ProblemKoreaType, ProblemType } from "../types/problem";

export const problemTypeToKorea = (
  problemType: ProblemType
): ProblemKoreaType => {
  switch (problemType) {
    case "MULTIPLE_CHOICE":
      return "객관식";
    case "SHORT_ANSWER":
      return "단답형";
    default:
      throw new Error(`Invalid difficulty: ${problemType}`);
  }
};
