import instance from "../../../../shared/apis/instance";
import type {
  ProblemItemResponse,
  SingleProblemQueryListType,
} from "../types/problem";

export const getSingleProblemsByQuery = async (
  query: SingleProblemQueryListType
): Promise<ProblemItemResponse[]> => {
  const { data } = await instance.get(
    `/v1/problem/single?mine=false&difficultyMinInclude=${query.difficulty}&difficultyMaxInclude=${query.difficulty}&answerType=${query.answerType}&coursePath=${query.coursePath}&year=${query.year}&location=${query.location}&pageSize=10&pageNumber=1`
  );

  return data.queryResults;
};
