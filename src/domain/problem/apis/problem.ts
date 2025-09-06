import instance from "../../../shared/apis/instance";
import type { ProblemResponse, QueryListType } from "../types/problem";

export const getProblemsByQuery = async (
  query: QueryListType,
  page: number
): Promise<ProblemResponse[]> => {
  if (query.school) {
    const { data } = await instance.get(
      `/v1/problem?mine=true&difficultyMinInclude=${query.difficulty}&difficultyMaxInclude=${query.difficulty}&answerType=${query.answerType}&coursePath=${query.coursePath}&year=${query.year}&location=${query.location}&schoolCode=${query.school.schoolCode}&pageSize=10&pageNumber=${page}`
    );

    return data.queryResults;
  } else {
    const { data } = await instance.get(
      `/v1/problem?mine=true&difficultyMinInclude=${query.difficulty}&difficultyMaxInclude=${query.difficulty}&answerType=${query.answerType}&coursePath=${query.coursePath}&year=${query.year}&location=${query.location}&schoolCode=&pageSize=10&pageNumber=${page}`
    );

    return data.queryResults;
  }
};
