import instance from "../../../shared/apis/instance";
import type { ProblemResponse, QueryListType } from "../types/problem";

export const getProblemsByQuery = async (
  query: QueryListType,
  page: number = 1,
  pageSize: number = 10
): Promise<ProblemResponse[]> => {
  console.log(page);
  if (query.school) {
    const { data } = await instance.get(
      `/v1/problem?mine=false&difficultyMinInclude=${query.difficulty}&difficultyMaxInclude=${query.difficulty}&answerType=${query.answerType}&coursePath=${query.coursePath}&year=${query.year}&location=${query.location}&schoolCode=${query.school.schoolCode}&pastProblem=${query.pastProblem}&pageSize=${pageSize}&pageNumber=${page}`
    );

    return data.queryResults;
  } else {
    const { data } = await instance.get(
      `/v1/problem?mine=false&difficultyMinInclude=${query.difficulty}&difficultyMaxInclude=${query.difficulty}&answerType=${query.answerType}&coursePath=${query.coursePath}&year=${query.year}&location=${query.location}&pastProblem=${query.pastProblem}&schoolCode=&pageSize=${pageSize}&pageNumber=${page}`
    );

    return data.queryResults;
  }
};
