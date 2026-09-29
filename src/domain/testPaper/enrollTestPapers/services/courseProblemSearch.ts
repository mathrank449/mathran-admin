import { getProblemPageByQuery } from "../../../problem/apis/problem";
import type {
  ProblemPageResponse,
  QueryListType,
} from "../../../problem/types/problem";
import {
  filterProblemsByCourseRules,
  selectedCourseRoots,
  type CourseSelectionRules,
} from "./courseSelection";

export const getProblemPageByCourseRules = async (
  query: QueryListType,
  rules: CourseSelectionRules,
  page = 1,
  pageSize = 12
): Promise<ProblemPageResponse> => {
  const roots = selectedCourseRoots(rules);
  const paths = roots.length === 0 ? [""] : roots;
  const pages = await Promise.all(
    paths.map((coursePath) =>
      getProblemPageByQuery({ ...query, coursePath }, page, pageSize)
    )
  );
  const merged = Array.from(
    new Map(
      pages
        .flatMap((result) => result.queryResults)
        .map((problem) => [problem.id, problem])
    ).values()
  );
  return {
    queryResults: filterProblemsByCourseRules(merged, rules),
    currentPageNumber: page,
    currentPageSize: pageSize,
    possibleNextPageNumbers: Array.from(
      new Set(pages.flatMap((result) => result.possibleNextPageNumbers))
    ).sort((left, right) => left - right),
  };
};
