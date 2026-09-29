import { describe, expect, test } from "vitest";
import type { ProblemResponse } from "../src/domain/problem/types/problem";
import {
  filterProblemsByCourseRules,
  isCourseSelected,
  selectedCourseRoots,
  toggleCourseSelection,
} from "../src/domain/testPaper/enrollTestPapers/services/courseSelection";
import { selectRandomProblems } from "../src/domain/testPaper/enrollTestPapers/services/randomProblemSelection";

const problem = (
  id: string,
  coursePath: string,
  difficulty: ProblemResponse["difficulty"]
) =>
  ({
    id,
    course: { target: { coursePath, courseName: coursePath }, parents: [] },
    difficulty,
  } as ProblemResponse);

describe("course selection rules", () => {
  test("selects every descendant and permits an individual child exclusion", () => {
    let rules = toggleCourseSelection({}, "aaaa");
    expect(isCourseSelected(rules, "aaaabbbbcccc")).toBe(true);

    rules = toggleCourseSelection(rules, "aaaabbbb");
    expect(isCourseSelected(rules, "aaaabbbbcccc")).toBe(false);
    expect(isCourseSelected(rules, "aaaadddd")).toBe(true);

    rules = toggleCourseSelection(rules, "aaaabbbb");
    expect(isCourseSelected(rules, "aaaabbbbcccc")).toBe(true);
    expect(selectedCourseRoots(rules)).toEqual(["aaaa"]);
  });

  test("filters merged API responses with the most specific rule", () => {
    const rules = { aaaa: true, aaaabbbb: false };
    const filtered = filterProblemsByCourseRules(
      [
        problem("1", "aaaabbbbcccc", "MID"),
        problem("2", "aaaaddddcccc", "MID"),
      ],
      rules
    );
    expect(filtered.map((item) => item.id)).toEqual(["2"]);
  });
});

describe("difficulty random selection", () => {
  const candidates = [
    problem("1", "aaaa", "LOW"),
    problem("2", "aaaa", "MID_LOW"),
    problem("3", "aaaa", "MID"),
    problem("4", "aaaa", "MID_HIGH"),
    problem("5", "aaaa", "HIGH"),
    problem("6", "aaaa", "KILLER"),
  ];

  test("selects the requested low, middle, and high counts without duplicates", () => {
    const selected = selectRandomProblems(
      candidates,
      { low: 2, middle: 1, high: 2 },
      () => 0
    );
    expect(selected).toHaveLength(5);
    expect(new Set(selected.map((item) => item.id)).size).toBe(5);
  });

  test("reports the exact shortage before mutating the assessment", () => {
    expect(() =>
      selectRandomProblems(candidates, { low: 3, middle: 0, high: 0 })
    ).toThrow(/3개가 필요하지만 2개/);
  });
});
