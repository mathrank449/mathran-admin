import instance from "../../../shared/apis/instance";
import type {
  ProblemPageResponse,
  ProblemResponse,
  QueryListType,
} from "../types/problem";

export const getProblemPageByQuery = async (
  query: QueryListType,
  page: number = 1,
  pageSize: number = 12
): Promise<ProblemPageResponse> => {
  const params = new URLSearchParams({
    mine: "false",
    pageSize: String(pageSize),
    pageNumber: String(page),
  });
  const optionalParams: Record<string, string | undefined> = {
    problemId: query.problemId,
    difficultyMinInclude: query.difficulty || undefined,
    difficultyMaxInclude: query.difficulty || undefined,
    answerType: query.answerType || undefined,
    coursePath: query.coursePath || undefined,
    year: query.year || undefined,
    location: query.location || undefined,
    schoolCode:
      query.school && typeof query.school === "object"
        ? query.school.schoolCode
        : undefined,
  };
  Object.entries(optionalParams).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  const { data } = await instance.get<ProblemPageResponse>(
    `/v1/problem?${params.toString()}`
  );
  return data;
};

export const getProblemsByQuery = async (
  query: QueryListType,
  page: number = 1,
  pageSize: number = 10
): Promise<ProblemResponse[]> => {
  return (await getProblemPageByQuery(query, page, pageSize)).queryResults;
};
