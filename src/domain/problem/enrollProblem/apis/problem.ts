import instance from "../../../../shared/apis/instance";

export const enrollProblemSingle = async (title: string, problemId: string) => {
  await instance.post(
    `/v1/problem/single?problemId=${problemId}&singleProblemName=${title}`
  );
};
