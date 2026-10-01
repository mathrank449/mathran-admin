import { getProblemPageByQuery } from "../../../problem/apis/problem";
import type { QueryListType } from "../../../problem/types/problem";
import {
  filterProblemsByCourseRules,
  selectedCourseRoots,
  type CourseSelectionRules,
} from "./courseSelection";
import { loadAllProblemPages } from "./problemPagination";
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
        loadAllProblemPages(
          { ...query, coursePath, difficulty },
          getProblemPageByQuery
        )
      )
    )
  );
  const merged = Array.from(
    new Map(
      pages
        .flatMap((problems) => problems)
        .map((problem) => [problem.id, problem])
    ).values()
  );
  return filterProblemsByCourseRules(merged, rules);
};
