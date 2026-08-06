import type { ScoreProblemResponse } from "../../../problem/types/problem";

export interface AssessmentPdfProblem extends ScoreProblemResponse {
  pdfGapAfter: number;
  imageAspectRatio: number;
}

export interface AssessmentRegisterPayload {
  assessmentName: string;
  items: {
    problemId: number;
    score: number;
  }[];
  minutes: number;
  answerInputDelaySeconds: 900;
}

export interface AssessmentPdfDraft {
  title: string;
  minutes: number;
  columnCount: 1 | 2;
  items: AssessmentPdfProblem[];
}

export const canonicalAssessmentUrl = (assessmentId: string) =>
  `https://www.mathrank.co.kr/assessment/${assessmentId}`;

export const parseAssessmentId = (data: unknown): string => {
  const rawId =
    typeof data === "object" && data !== null && "assessmentId" in data
      ? (data as { assessmentId: unknown }).assessmentId
      : data;
  const assessmentId = String(rawId ?? "");
  if (!/^[1-9]\d*$/.test(assessmentId)) {
    throw new Error(
      "시험지는 등록되었지만 서버가 assessmentId를 반환하지 않았습니다."
    );
  }
  return assessmentId;
};

export const validateAssessmentPdfDraft = (
  draft: AssessmentPdfDraft
): string | null => {
  if (draft.title.trim().length === 0) {
    return "문제집 제목을 입력해주세요.";
  }
  if (!Number.isInteger(draft.minutes) || draft.minutes < 16 || draft.minutes > 600) {
    return "시험 시간은 16분 이상 600분 이하로 입력해주세요.";
  }
  if (draft.items.length === 0) {
    return "문항을 한 개 이상 선택해주세요.";
  }
  if (draft.items.length > 50) {
    return "한 시험지에는 최대 50문항까지 넣을 수 있습니다.";
  }
  if (draft.items.some((item) => item.score <= 0)) {
    return "모든 문항의 점수는 1점 이상이어야 합니다.";
  }
  const totalScore = draft.items.reduce((sum, item) => sum + item.score, 0);
  if (totalScore !== 100) {
    return `총점은 100점이어야 합니다. (현재: ${totalScore}점)`;
  }
  if (
    draft.items.some(
      (item) =>
        !Number.isFinite(item.imageAspectRatio) || item.imageAspectRatio <= 0
    )
  ) {
    return "문제 이미지 비율을 확인할 수 없습니다.";
  }
  return null;
};

export const toAssessmentRegisterPayload = (
  draft: AssessmentPdfDraft
): AssessmentRegisterPayload => ({
  assessmentName: draft.title.trim(),
  items: draft.items.map((item) => ({
    problemId: Number(item.id),
    score: item.score,
  })),
  minutes: draft.minutes,
  answerInputDelaySeconds: 900,
});
