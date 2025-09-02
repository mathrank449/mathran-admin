import { AxiosError } from "axios";
import instance from "../../../shared/apis/instance";
import type { ChallengeLog, ChallengeLogDetail } from "../types/challengeLog";

export const getChallengeLogsBySingleProblemId = async (
  singleProblemId: string
): Promise<ChallengeLog[]> => {
  try {
    const { data } = await instance.get<ChallengeLog[]>(
      `/v1/problem/single/${singleProblemId}/challenge-log`
    );

    return data;
  } catch (e) {
    if (e instanceof AxiosError) {
      throw e.message;
    }
    throw e;
  }
};

export const getDetailedChallengeLogByChallengeLogId = async (
  challengeLogId: string
): Promise<ChallengeLogDetail> => {
  try {
    const { data } = await instance.get<ChallengeLogDetail>(
      `/v1/problem/single/challenge-log/${challengeLogId}/rank`
    );

    return data;
  } catch (e) {
    if (e instanceof AxiosError) {
      throw e.message;
    }
    throw e;
  }
};
