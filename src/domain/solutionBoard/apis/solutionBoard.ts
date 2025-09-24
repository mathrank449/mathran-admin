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
    if (query.postType === "FREE" || query.postType === "NOTICE") {
      const response = await instance.get(
        `/v1/board/post?postType=${query.postType}&title=${query.title}&nickName=${query.nickName}&page=${page}&pageSize=10`
      );
      return response.data;
    }
    if (query.postType === "SINGLE_PROBLEM") {
      const response = await instance.get(
        `/v1/board/post?postType=${query.postType}&title=${
          query.title
        }&nickName=${query.nickName}&singleProblemId=${
          query.singleProblemId ?? ""
        }&page=${page}&pageSize=10`
      );
      return response.data;
    }
    if (query.postType === "ASSESSMENT") {
      const response = await instance.get(
        `/v1/board/post?postType=${query.postType}&title=${
          query.title
        }&nickName=${query.nickName}&assessmentId=${
          query.assessmentId ?? ""
        }&page=${page}&pageSize=10`
      );
      return response.data;
    }
    if (query.postType === "CONTEST") {
      const response = await instance.get(
        `/v1/board/post?postType=${query.postType}&title=${
          query.title
        }&nickName=${query.nickName}&contestId=${
          query.contestId ?? ""
        }&page=${page}&pageSize=10`
      );
      return response.data;
    }
    const response = await instance.get(
      `/v1/board/post?title=${query.title}&nickName=${query.nickName}&page=${page}&pageSize=10`
    );
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
    console.log(e);
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
    console.log(e);
  }
};

export const deleteSolution = async (postId: string) => {
  try {
    const response = await instance.delete(`/v1/board/post/${postId}`);

    return response.data;
  } catch (e) {
    console.log(e);
  }
};
