import instance from "../../../../../shared/apis/instance";

export const postComment = async (postId: string, content: string) => {
  try {
    const { data } = await instance.post(
      `/v1/board/post/${postId}/comment?content=${content}`
    );

    return data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const deleteComment = async (commentId: string) => {
  try {
    const { data } = await instance.delete(
      `/v1/board/post/comment/${commentId}`
    );

    return data;
  } catch (e) {
    console.log(e);
  }
};

export const modifyComment = async (commentId: string, content: string) => {
  try {
    const { data } = await instance.put(
      `/v1/board/post/comment/${commentId}?content=${content}`
    );

    return data;
  } catch (e) {
    console.log(e);
  }
};
