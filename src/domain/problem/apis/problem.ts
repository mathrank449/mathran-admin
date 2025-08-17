import instance from "../../../shared/apis/instance";
import type { ProblemResponse, QueryListType } from "../types/problem";

export const getProblemsByQuery = async (
  query: QueryListType
): Promise<ProblemResponse[]> => {
  const { data } = await instance.get(
    `/v1/problem?&mine=false&difficultyMinInclude=${query.difficulty}&difficultyMaxInclude=${query.difficulty}&answerType=${query.answerType}&coursePath=${query.coursePath}&year=${query.year}&location=${query.location}&pageSize=20&pageNumber=1`
  );

  return data.queryResults;
};
