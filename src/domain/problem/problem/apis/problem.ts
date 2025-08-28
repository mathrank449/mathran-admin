import { AxiosError } from "axios";
import instance from "../../../../shared/apis/instance";
import type {
  ProblemItemResponse,
  SingleProblemQueryListType,
  SubmitAnswerResponse,
} from "../types/problem";

export const getSingleProblemsByQuery = async (
  query: SingleProblemQueryListType
): Promise<ProblemItemResponse[]> => {
  try {
    let problemResponse;
    if (query.queryType === "all") {
      problemResponse = await instance.get(
        `/v1/problem/single?singleProblemId=&coursePath=${query.courseInfo?.coursePath}&singleProblemName=${query.singleProblemName}&answerType=&difficultyMinInclude=${query.difficulty}&difficultyMaxInclude=${query.difficulty}&pageSize=10&pageNumber=1`
      );
    }

    if (query.queryType === "new") {
      problemResponse = await instance.get(
        `/v1/problem/single?singleProblemId=&coursePath=${query.courseInfo?.coursePath}&singleProblemName=${query.singleProblemName}&answerType=&difficultyMinInclude=${query.difficulty}&difficultyMaxInclude=${query.difficulty}&orderColumn=DATE&direction=DESC&pageSize=10&pageNumber=1`
      );
    }
    if (query.queryType === "popular") {
      problemResponse = await instance.get(
        `/v1/problem/single?singleProblemId=&coursePath=${query.courseInfo?.coursePath}&singleProblemName=${query.singleProblemName}&answerType=&difficultyMinInclude=${query.difficulty}&difficultyMaxInclude=${query.difficulty}&orderColumn=TOTAL_TRY_COUNT&direction=DESC&pageSize=10&pageNumber=1`
      );
    } else {
      problemResponse = await instance.get(
        `/v1/problem/single?singleProblemId=&coursePath=${query.courseInfo?.coursePath}&singleProblemName=${query.singleProblemName}&answerType=&difficultyMinInclude=${query.difficulty}&difficultyMaxInclude=${query.difficulty}&pageSize=10&pageNumber=1`
      );
    }

    return problemResponse.data.queryResults;
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
  answers: string[]
): Promise<SubmitAnswerResponse> => {
  try {
    const { data } = await instance.post(
      `/v1/problem/single/solve?singleProblemId=${id}&answers=${answers}`
    );

    return data;
  } catch (e) {
    if (e instanceof AxiosError) {
      throw e.message;
    }
    throw e;
  }
};
