import type {
  ProblemPageResponse,
  ProblemResponse,
  QueryListType,
} from "../../../problem/types/problem";

export const RANDOM_CANDIDATE_PAGE_SIZE = 20;

export type ProblemPageFetcher = (
  query: QueryListType,
  page: number,
  pageSize: number
) => Promise<ProblemPageResponse>;

export const loadAllProblemPages = async (
  query: QueryListType,
  fetchPage: ProblemPageFetcher
): Promise<ProblemResponse[]> => {
  const problems: ProblemResponse[] = [];
  const visitedPages = new Set<number>();
  let pageNumber = 1;

  while (!visitedPages.has(pageNumber)) {
    visitedPages.add(pageNumber);
    const page = await fetchPage(
      query,
      pageNumber,
      RANDOM_CANDIDATE_PAGE_SIZE
    );
    problems.push(...page.queryResults);

    const nextPage = page.possibleNextPageNumbers.find(
      (candidate) => candidate > pageNumber && !visitedPages.has(candidate)
    );
    if (nextPage === undefined) break;
    pageNumber = nextPage;
  }

  return problems;
};
