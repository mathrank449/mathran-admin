import { AxiosError } from "axios";
import instance from "../../../../shared/apis/instance";
import type {
  ProblemItemResponse,
  ProblemListPagination,
  SingleProblemQueryListType,
  SubmitAnswerResponse,
} from "../types/problem";
import type { School } from "../../types/school";

export const getSingleProblemsByQuery = async (
  query: SingleProblemQueryListType,
  page: number,
  school?: School | undefined,
  region?: string | undefined,
  district?: string | undefined
): Promise<ProblemListPagination> => {
  const location = [region, district].filter(Boolean).join(" ");
  try {
    let problemResponse;
    if (query.queryType === "all") {
      problemResponse = await instance.get(
        `/v1/problem/single?singleProblemId=&coursePath=${
          query.courseInfo?.coursePath
        }&singleProblemName=${
          query.singleProblemName
        }&answerType=&difficultyMinInclude=${
          query.difficulty
        }&difficultyMaxInclude=${query.difficulty}&schoolCode=${
          school?.schoolCode ?? ""
        }&location=${location}&pageSize=10&pageNumber=${page}`
      );
    }

    if (query.queryType === "new") {
      problemResponse = await instance.get(
        `/v1/problem/single?singleProblemId=&coursePath=${
          query.courseInfo?.coursePath
        }&singleProblemName=${
          query.singleProblemName
        }&answerType=&difficultyMinInclude=${
          query.difficulty
        }&difficultyMaxInclude=${query.difficulty}&schoolCode=${
          school?.schoolCode ?? ""
        }&location=${location}&orderColumn=DATE&direction=DESC&pageSize=10&pageNumber=${page}`
      );
    }
    if (query.queryType === "popular") {
      problemResponse = await instance.get(
        `/v1/problem/single?singleProblemId=&coursePath=${
          query.courseInfo?.coursePath
        }&singleProblemName=${
          query.singleProblemName
        }&answerType=&difficultyMinInclude=${
          query.difficulty
        }&difficultyMaxInclude=${query.difficulty}&schoolCode=${
          school?.schoolCode ?? ""
        }&location=${location}&orderColumn=TOTAL_TRY_COUNT&direction=DESC&pageSize=10&pageNumber=${page}`
      );
    } else {
      problemResponse = await instance.get(
        `/v1/problem/single?singleProblemId=&coursePath=${
          query.courseInfo?.coursePath
        }&singleProblemName=${
          query.singleProblemName
        }&answerType=&difficultyMinInclude=${
          query.difficulty
        }&difficultyMaxInclude=${query.difficulty}&schoolCode=${
          school?.schoolCode ?? ""
        }&location=${location}&pageSize=10&pageNumber=${page}`
      );
    }

    return problemResponse.data;
  } catch (e) {
    if (e instanceof AxiosError) {
      throw e.message;
    }
    throw e;
  }
};

export const getSingleProblemById = async (
  id: string
): Promise<ProblemItemResponse> => {
  try {
    const { data } = await instance.get(
      `/v1/problem/single?singleProblemId=${id}`
    );
    return data.queryResults[0];
  } catch (e) {
    if (e instanceof AxiosError) {
      throw e.message;
    }
    throw e;
  }
};

export const solveSingleProblem = async (
  id: string,
  answers: string[],
  elapsedTimeSeconds: number
): Promise<SubmitAnswerResponse> => {
  try {
    const { data } = await instance.post(
      `/v1/problem/single/solve?singleProblemId=${id}&answers=${answers}&elapsedTimeSeconds=${elapsedTimeSeconds}`
    );

    return data;
  } catch (e) {
    if (e instanceof AxiosError) {
      throw e.message;
    }
    throw e;
  }
};
