import { beforeEach, describe, expect, test } from "vitest";
import type { ScoreProblemResponse } from "../src/domain/problem/types/problem";
import { useContestStore } from "../src/domain/contest/enrollContest/hooks/useContestStore";

const problem = (id: string) => ({ id, score: 0 } as ScoreProblemResponse);
const store = () => useContestStore.getState();
const ids = () => store().contestProblems.map((item) => item.id);
const scores = () => store().contestProblems.map((item) => item.score);

describe("contest store", () => {
  beforeEach(() => store().reset());

  test("rebalances to 100 points on insert and remove, ignoring duplicates", () => {
    store().insertProblem(problem("1"));
    store().insertProblem(problem("2"));
    store().insertProblem(problem("3"));
    store().insertProblem(problem("2"));
    expect(ids()).toEqual(["1", "2", "3"]);
    expect(scores()).toEqual([34, 33, 33]);

    store().removeProblem(0);
    expect(ids()).toEqual(["2", "3"]);
    expect(scores()).toEqual([50, 50]);
  });

  test("moves a problem and keeps its score", () => {
    ["1", "2", "3"].forEach((id) => store().insertProblem(problem(id)));
    store().setProblemScore(2, 10);
    store().moveProblem(2, 0);
    expect(ids()).toEqual(["3", "1", "2"]);
    expect(scores()).toEqual([10, 34, 33]);

    store().moveProblem(0, 5);
    expect(ids()).toEqual(["3", "1", "2"]);
  });

  test("stops at 50 problems", () => {
    for (let index = 1; index <= 51; index += 1) {
      store().insertProblem(problem(String(index)));
    }
    expect(store().contestProblems).toHaveLength(50);
    expect(scores().reduce((sum, score) => sum + score, 0)).toBe(100);
  });

  test("reset clears problems and contest info", () => {
    store().insertProblem(problem("1"));
    store().setTitle("대회");
    store().reset();
    expect(store().contestProblems).toEqual([]);
    expect(store().title).toBe("");
    expect(store().minutes).toBe(60);
  });
});
