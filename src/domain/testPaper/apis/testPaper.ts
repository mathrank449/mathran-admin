import { AxiosError } from "axios";
import instance from "../../../shared/apis/instance";
import type {
  TestPaperDetailedResponse,
  TestPaperQueryListType,
  TestPaperResponse,
} from "../types/testPaper";
import type { ApiError } from "../../../shared/type/error";
import type { ProblemSolution } from "../../problem/problem/types/problem";

export const getTestPapersByQuery = async (
  query: TestPaperQueryListType,
  page: number
): Promise<TestPaperResponse> => {
  try {
    let response;
    if (query.queryType === "all") {
      response = await instance.get(
        `/v1/problem/assessment?assessmentName=${query.testPaperName}&difficulty=${query.difficulty}&pageSize=20&pageNumber=${page}`
      );
    } else if (query.queryType === "new") {
      response = await instance.get(
        `/v1/problem/assessment?assessmentName=${query.testPaperName}&difficulty=${query.difficulty}&order=LATEST&direction=DESC&pageSize=20&pageNumber=${page}`
      );
    } else if (query.queryType === "popular") {
      response = await instance.get(
        `/v1/problem/assessment?assessmentName=${query.testPaperName}&difficulty=${query.difficulty}&order=DISTINCT_USER_COUNT&direction=DESC&pageSize=20&pageNumber=${page}`
      );
    } else {
      response = await instance.get(
        `/v1/problem/assessment?assessmentName=${query.testPaperName}&difficulty=${query.difficulty}&pageSize=20&pageNumber=${page}`
      );
    }
    return response?.data;
  } catch (e) {
    if (e instanceof AxiosError) {
      throw e.message;
    }
    throw e;
  }
};

export const getTestPapersById = async (
  id: string
): Promise<TestPaperDetailedResponse> => {
  try {
    const response = await instance.get(`/v1/problem/assessment/${id}`);
    return response?.data;
  } catch (e) {
    if (e instanceof AxiosError) {
      throw e.message;
    }
    throw e;
  }
};

export const submitTestPapersByTestPaperId = async (
  assessmentId: string,
  submittedAnswers: string[][],
  elapsedTimeSeconds: number
): Promise<string> => {
  try {
    const { data } = await instance.post(`/v1/problem/assessment/submission`, {
      assessmentId,
      submittedAnswers,
      elapsedTimeSeconds,
    });
    return data;
  } catch (e) {
    if (e instanceof AxiosError) {
      throw e.message;
    }
    throw e;
  }
};

export const deleteTestPaperById = async (testPaperId: string) => {
  try {
    await instance.delete(`/v1/problem/assessment/${testPaperId}`);
  } catch (e) {
    if (e instanceof AxiosError) {
      if (e.response) throw e.response.data as ApiError; // 타입 단언
      throw { code: -1, message: e.message } as ApiError;
    }
    throw e;
  }
};

export const modifyTestPaperById = async (
  testPaperId: string,
  name: string
) => {
  try {
    await instance.put(
      `/v1/problem/assessment/${testPaperId}?assessmentName=${name}`
    );
  } catch (e) {
    if (e instanceof AxiosError) {
      if (e.response) throw e.response.data as ApiError; // 타입 단언
      throw { code: -1, message: e.message } as ApiError;
    }
    throw e;
  }
};

export const getTestPaperSolutionById = async (
  id: string
): Promise<ProblemSolution[]> => {
  try {
    const { data } = await instance.get(`/v1/problem/contest/${id}/solution`);
    return data.results;
  } catch (e) {
    if (e instanceof AxiosError) {
      throw e.message;
    }
    throw e;
  }
};
