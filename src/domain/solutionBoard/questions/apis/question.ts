import instance from "../../../../shared/apis/instance";
import type { Question } from "../types/question";

export const getQuestionById = async (postId: string): Promise<Question> => {
  try {
    const { data } = await instance.get(`/v1/board/post/${postId}`);

    return data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
