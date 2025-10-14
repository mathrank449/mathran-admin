import { AxiosError } from "axios";
import instance from "../../../shared/apis/instance";
import type {
  ModifySolutionType,
  PostSolutionType,
  SolutionBoardQuery,
} from "../type/solutionBoard";
import type { QuestionPostsResponsePagination } from "../types/question";

export const getAllSolutionBoard = async (
  query: SolutionBoardQuery,
  page: number
): Promise<QuestionPostsResponsePagination> => {
  try {
    // 기본 파라미터 객체 구성
    const params: Record<string, string | number | undefined> = {
      page,
      pageSize: 10,
      postType: query.postType,
    };

    // 값이 존재할 때만 추가
    if (query.title) params.title = query.title;
    if (query.nickName) params.nickName = query.nickName;

    if (query.postType === "SINGLE_PROBLEM" && query.singleProblemId)
      params.singleProblemId = query.singleProblemId;
    if (query.postType === "ASSESSMENT" && query.assessmentId)
      params.assessmentId = query.assessmentId;
    if (query.postType === "CONTEST" && query.contestId)
      params.contestId = query.contestId;

    // Axios 요청
    const response = await instance.get("/v1/board/post", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching course:", error);
    throw error;
  }
};

export const postSolution = async (postData: PostSolutionType) => {
  try {
    if (postData.postType === "FREE" || postData.postType === "NOTICE") {
      const response = await instance.post(
        `/v1/board/post?postType=${postData.postType}&title=${postData.title}&content=${postData.content}`
      );

      return response.data;
    }

    if (postData.postType === "SINGLE_PROBLEM") {
      const response = await instance.post(
        `/v1/board/post?postType=${postData.postType}&title=${postData.title}&content=${postData.content}&problemId=${postData.problemId}`
      );

      return response.data;
    }

    if (postData.postType === "ASSESSMENT") {
      const response = await instance.post(
        `/v1/board/post?postType=${postData.postType}&title=${postData.title}&content=${postData.content}&assessmentId=${postData.assessmentId}`
      );

      return response.data;
    }

    if (postData.postType === "CONTEST") {
      const response = await instance.post(
        `/v1/board/post?postType=${postData.postType}&title=${postData.title}&content=${postData.content}&contestId=${postData.contestId}`
      );

      return response.data;
    }
  } catch (e) {
    if (e instanceof AxiosError) {
      throw e.message;
    }
    throw e;
  }
};

export const modifySolution = async (
  postId: string,
  modifyData: ModifySolutionType
) => {
  try {
    const response = await instance.put(
      `/v1/board/post/${postId}?title=${modifyData.title}&content=${modifyData.content}`
    );

    return response.data;
  } catch (e) {
    if (e instanceof AxiosError) {
      throw e.message;
    }
    throw e;
  }
};

export const deleteSolution = async (postId: string) => {
  try {
    const response = await instance.delete(`/v1/board/post/${postId}`);

    return response.data;
  } catch (e) {
    if (e instanceof AxiosError) {
      throw e.message;
    }
    throw e;
  }
};
