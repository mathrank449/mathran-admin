import type { ProblemResponse } from "../../../problem/types/problem";

export type CourseSelectionRules = Record<string, boolean>;

const inheritedSelection = (
  rules: CourseSelectionRules,
  coursePath: string,
  excludeSelf = false
) => {
  const matched = Object.entries(rules)
    .filter(
      ([rulePath]) =>
        coursePath.startsWith(rulePath) && (!excludeSelf || rulePath !== coursePath)
    )
    .sort(([left], [right]) => right.length - left.length);
  return matched[0]?.[1] ?? false;
};

export const isCourseSelected = (
  rules: CourseSelectionRules,
  coursePath: string
) => inheritedSelection(rules, coursePath);

export const toggleCourseSelection = (
  rules: CourseSelectionRules,
  coursePath: string
): CourseSelectionRules => {
  const next = Object.fromEntries(
    Object.entries(rules).filter(([rulePath]) => !rulePath.startsWith(coursePath))
  );
  const desired = !isCourseSelected(rules, coursePath);
  if (desired !== inheritedSelection(rules, coursePath, true)) {
    next[coursePath] = desired;
  }
  return next;
};

export const selectedCourseRoots = (rules: CourseSelectionRules) =>
  Object.entries(rules)
    .filter(([, selected]) => selected)
    .map(([path]) => path)
    .sort((left, right) => left.length - right.length);

export const filterProblemsByCourseRules = (
  problems: ProblemResponse[],
  rules: CourseSelectionRules
) => {
  if (Object.keys(rules).length === 0) return problems;
  return problems.filter((problem) =>
    isCourseSelected(rules, problem.course.target.coursePath)
  );
};
