import { describe, expect, test } from "vitest";
import type { ScoreProblemResponse } from "../src/domain/problem/types/problem";
import { distributeScores } from "../src/domain/testPaper/enrollTestPapers/services/scoreDistribution";
import {
  defaultContestPeriod,
  toContestRegisterPayload,
  validateContestDraft,
  type ContestDraft,
} from "../src/domain/contest/enrollContest/services/contestDraft";

const problem = (id: string, score: number) =>
  ({ id, score } as ScoreProblemResponse);

const draft = (overrides: Partial<ContestDraft> = {}): ContestDraft => ({
  title: "10월 경시대회",
  minutes: 60,
  startAt: "2026-11-01T09:00",
  endAt: "2026-11-07T23:59",
  problems: [problem("1", 50), problem("2", 50)],
  ...overrides,
});

describe("distributeScores", () => {
  test("splits 100 points and gives the remainder to the first items", () => {
    expect(
      distributeScores([problem("1", 0), problem("2", 0), problem("3", 0)]).map(
        (item) => item.score
      )
    ).toEqual([34, 33, 33]);
  });

  test("keeps an empty list empty", () => {
    expect(distributeScores([])).toEqual([]);
  });
});

describe("validateContestDraft", () => {
  test("accepts a complete draft", () => {
    expect(validateContestDraft(draft())).toBeNull();
  });

  test.each([
    [{ title: "  " }, "경시대회 제목을 입력해주세요."],
    [{ minutes: 0 }, "시간 제한은 1분부터 600분까지 입력할 수 있습니다."],
    [{ minutes: 601 }, "시간 제한은 1분부터 600분까지 입력할 수 있습니다."],
    [{ startAt: "" }, "시작 일시와 종료 일시를 입력해주세요."],
    [
      { endAt: "2026-11-01T09:00" },
      "종료 일시는 시작 일시보다 뒤여야 합니다.",
    ],
    [{ problems: [] }, "문항을 한 개 이상 선택해주세요."],
    [
      { problems: [problem("1", 100), problem("2", 0)] },
      "모든 문항의 점수는 1점 이상이어야 합니다.",
    ],
    [
      { problems: [problem("1", 40), problem("2", 50)] },
      "총점은 100점이어야 합니다. (현재: 90점)",
    ],
  ])("rejects %o", (overrides, message) => {
    expect(validateContestDraft(draft(overrides))).toBe(message);
  });

  test("rejects more than 50 problems", () => {
    const problems = Array.from({ length: 51 }, (_, index) =>
      problem(String(index + 1), index === 0 ? 50 : 1)
    );
    expect(validateContestDraft(draft({ problems }))).toBe(
      "한 경시대회에는 최대 50문항까지 넣을 수 있습니다."
    );
  });
});

describe("toContestRegisterPayload", () => {
  test("maps the draft to the contest register API body", () => {
    expect(toContestRegisterPayload(draft({ title: " 10월 경시대회 " }))).toEqual({
      contestName: "10월 경시대회",
      items: [
        { problemId: 1, score: 50 },
        { problemId: 2, score: 50 },
      ],
      minutes: 60,
      startAt: "2026-11-01T09:00:00",
      endAt: "2026-11-07T23:59:59",
    });
  });

  test("ignores seconds already present in datetime-local values", () => {
    const payload = toContestRegisterPayload(
      draft({ startAt: "2026-11-01T09:00:30", endAt: "2026-11-07T23:59:10" })
    );
    expect(payload.startAt).toBe("2026-11-01T09:00:00");
    expect(payload.endAt).toBe("2026-11-07T23:59:59");
  });
});

describe("defaultContestPeriod", () => {
  test("starts today at 00:00 and ends today at 23:59 in local time", () => {
    expect(defaultContestPeriod(new Date(2026, 9, 21, 15, 30))).toEqual({
      startAt: "2026-10-21T00:00",
      endAt: "2026-10-21T23:59",
    });
  });
});
