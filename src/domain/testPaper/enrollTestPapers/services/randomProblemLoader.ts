import { getProblemPageByQuery } from "../../../problem/apis/problem";
import type { QueryListType } from "../../../problem/types/problem";
import {
  filterProblemsByCourseRules,
  selectedCourseRoots,
  type CourseSelectionRules,
} from "./courseSelection";
import { randomSelectionDifficulties } from "./randomProblemSelection";

export const loadRandomProblemCandidates = async (
  query: QueryListType,
  rules: CourseSelectionRules
) => {
  const roots = selectedCourseRoots(rules);
  const paths = roots.length === 0 ? [""] : roots;
  const pages = await Promise.all(
    randomSelectionDifficulties.flatMap((difficulty) =>
      paths.map((coursePath) =>
        getProblemPageByQuery({ ...query, coursePath, difficulty }, 1, 100)
      )
    )
  );
  const merged = Array.from(
    new Map(
      pages
        .flatMap((page) => page.queryResults)
        .map((problem) => [problem.id, problem])
    ).values()
  );
  return filterProblemsByCourseRules(merged, rules);
};
