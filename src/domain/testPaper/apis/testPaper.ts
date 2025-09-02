import { AxiosError } from "axios";
import instance from "../../../shared/apis/instance";
import type {
  TestPaperDetailedResponse,
  TestPaperQueryListType,
  TestPaperResponse,
} from "../types/testPaper";

export const getTestPapersByQuery = async (
  query: TestPaperQueryListType
): Promise<TestPaperResponse> => {
  try {
    let response;
    if (query.queryType === "all") {
      response = await instance.get(
        `/v1/problem/assessment?assessmentName=${query.testPaperName}&difficulty=${query.difficulty}&pageSize=20&pageNumber=1`
      );
    } else if (query.queryType === "new") {
      response = await instance.get(
        `/v1/problem/assessment?assessmentName=${query.testPaperName}&difficulty=${query.difficulty}&order=LATEST&direction=DESC&pageSize=20&pageNumber=1`
      );
    } else if (query.queryType === "popular") {
      response = await instance.get(
        `/v1/problem/assessment?assessmentName=${query.testPaperName}&difficulty=${query.difficulty}&order=DISTINCT_USER_COUNT&direction=DESC&pageSize=20&pageNumber=1`
      );
    } else {
      response = await instance.get(
        `/v1/problem/assessment?assessmentName=${query.testPaperName}&difficulty=${query.difficulty}&pageSize=20&pageNumber=1`
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
