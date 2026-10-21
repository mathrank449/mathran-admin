import type { ScoreProblemResponse } from "../../../problem/types/problem";

export const CONTEST_MAX_PROBLEMS = 50;

export interface ContestDraft {
  title: string;
  minutes: number;
  /** datetime-local 값 (YYYY-MM-DDTHH:mm), 브라우저 현지 시각 */
  startAt: string;
  endAt: string;
  problems: ScoreProblemResponse[];
}

export interface ContestRegisterPayload {
  contestName: string;
  items: {
    problemId: number;
    score: number;
  }[];
  minutes: number;
  startAt: string;
  endAt: string;
}

const toMinutePrecision = (value: string) => value.slice(0, 16);

const pad = (value: number) => String(value).padStart(2, "0");

export const defaultContestPeriod = (now: Date = new Date()) => {
  const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  return { startAt: `${today}T00:00`, endAt: `${today}T23:59` };
};

export const validateContestDraft = (draft: ContestDraft): string | null => {
  if (draft.title.trim().length === 0) {
    return "경시대회 제목을 입력해주세요.";
  }
  if (!Number.isInteger(draft.minutes) || draft.minutes < 1 || draft.minutes > 600) {
    return "시간 제한은 1분부터 600분까지 입력할 수 있습니다.";
  }
  if (!draft.startAt || !draft.endAt) {
    return "시작 일시와 종료 일시를 입력해주세요.";
  }
  if (toMinutePrecision(draft.endAt) <= toMinutePrecision(draft.startAt)) {
    return "종료 일시는 시작 일시보다 뒤여야 합니다.";
  }
  if (draft.problems.length === 0) {
    return "문항을 한 개 이상 선택해주세요.";
  }
  if (draft.problems.length > CONTEST_MAX_PROBLEMS) {
    return `한 경시대회에는 최대 ${CONTEST_MAX_PROBLEMS}문항까지 넣을 수 있습니다.`;
  }
  if (draft.problems.some((problem) => problem.score <= 0)) {
    return "모든 문항의 점수는 1점 이상이어야 합니다.";
  }
  const totalScore = draft.problems.reduce((sum, problem) => sum + problem.score, 0);
  if (totalScore !== 100) {
    return `총점은 100점이어야 합니다. (현재: ${totalScore}점)`;
  }
  return null;
};

export const toContestRegisterPayload = (
  draft: ContestDraft
): ContestRegisterPayload => ({
  contestName: draft.title.trim(),
  items: draft.problems.map((problem) => ({
    problemId: Number(problem.id),
    score: problem.score,
  })),
  minutes: draft.minutes,
  // 종료 시각은 그 분의 마지막 초까지 응시를 허용한다.
  startAt: `${toMinutePrecision(draft.startAt)}:00`,
  endAt: `${toMinutePrecision(draft.endAt)}:59`,
});
