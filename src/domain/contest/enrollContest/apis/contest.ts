import { AxiosError } from "axios";
import instance from "../../../../shared/apis/instance";

export const enrollTestPapers = async (contest: {
  title: string;
  problems: {
    problemId: string;
    score: number;
  }[];
  time: number;
  startAt: string;
  endAt: string;
}) => {
  try {
    await instance.post("/v1/problem/contest", {
      contestName: contest.title,
      items: contest.problems,
      minutes: contest.time,
      startAt: contest.startAt,
      endAt: contest.endAt,
    });
  } catch (e) {
    if (e instanceof AxiosError) {
      throw Error(e.message);
    }
  }
};
