import { AxiosError } from "axios";
import instance from "../../../shared/apis/instance";
import type {
  ContestDetailedResponse,
  ContestQueryListType,
  ContestResponse,
} from "../types/contest";
import type { ApiError } from "../../../shared/type/error";
import type { ProblemSolution } from "../../problem/problem/types/problem";

export const getContestByQuery = async (
  query: ContestQueryListType,
  page: number
): Promise<ContestResponse> => {
  try {
    let response;
    if (query.queryType === "all") {
      response = await instance.get(
        `/v1/problem/contest?contestName=${query.contestName}&difficulty=${query.difficulty}&pageSize=20&pageNumber=${page}`
      );
    } else if (query.queryType === "new") {
      response = await instance.get(
        `/v1/problem/contest?contestName=${query.contestName}&difficulty=${query.difficulty}&order=LATEST&direction=DESC&pageSize=20&pageNumber=${page}`
      );
    } else if (query.queryType === "popular") {
      response = await instance.get(
        `/v1/problem/contest?contestName=${query.contestName}&difficulty=${query.difficulty}&order=DISTINCT_USER_COUNT&direction=DESC&pageSize=20&pageNumber=${page}`
      );
    } else {
      response = await instance.get(
        `/v1/problem/contest?contestName=${query.contestName}&difficulty=${query.difficulty}&pageSize=20&pageNumber=${page}`
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

export const getContestById = async (
  id: string
): Promise<ContestDetailedResponse> => {
  try {
    const response = await instance.get(`/v1/problem/contest/${id}`);
    return response?.data;
  } catch (e) {
    if (e instanceof AxiosError) {
      throw e.message;
    }
    throw e;
  }
};

export const submitContestByContestId = async (
  contestId: string,
  submittedAnswers: string[][],
  elapsedTimeSeconds: number
): Promise<string> => {
  try {
    const { data } = await instance.post(`/v1/problem/contest/submission`, {
      contestId,
      submittedAnswers,
      elapsedTimeSeconds,
    });
    return data;
  } catch (e) {
    console.log(e);
    if (e instanceof AxiosError) {
      if (e.response) throw e.response.data as ApiError; // 타입 단언
      throw { code: -1, message: e.message } as ApiError;
    }
    throw e;
  }
};

export const deleteContestById = async (contestId: string) => {
  try {
    await instance.delete(`/v1/problem/contest/${contestId}`);
  } catch (e) {
    if (e instanceof AxiosError) {
      if (e.response) throw e.response.data as ApiError; // 타입 단언
      throw { code: -1, message: e.message } as ApiError;
    }
    throw e;
  }
};

export const modifyContestById = async (
  contestId: string,
  contestName: string
) => {
  try {
    await instance.put(
      `/v1/problem/contest/${contestId}?contestName=${contestName}`
    );
  } catch (e) {
    if (e instanceof AxiosError) {
      if (e.response) throw e.response.data as ApiError; // 타입 단언
      throw { code: -1, message: e.message } as ApiError;
    }
    throw e;
  }
};

export const getContestSolutionById = async (
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
