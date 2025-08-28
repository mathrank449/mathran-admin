import { AxiosError } from "axios";
import instance from "../../../../shared/apis/instance";

export const enrollTestPapers = async (testPapers: {
  title: string;
  problems: {
    problemId: string;
    score: number;
  }[];
  time: number;
}) => {
  try {
    await instance.post("/v1/problem/assessment", {
      assessmentName: testPapers.title,
      items: testPapers.problems,
      minutes: testPapers.time,
      difficulty: "KILLER",
    });
  } catch (e) {
    if (e instanceof AxiosError) {
      throw Error(e.message);
    }
  }
};
