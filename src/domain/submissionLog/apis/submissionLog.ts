import { AxiosError } from "axios";
import instance from "../../../shared/apis/instance";
import type {
  SubmissionDetail,
  SubmissionLogItem,
} from "../types/submissionLog";

export const getSubmissionLogsByAssessmentId = async (
  assessmentId: string
): Promise<SubmissionLogItem[]> => {
  try {
    const { data } = await instance.get<{ responses: SubmissionLogItem[] }>(
      `/v1/problem/assessment/${assessmentId}/submission`
    );

    return data.responses;
  } catch (e) {
    if (e instanceof AxiosError) {
      throw e.message;
    }
    throw e;
  }
};

export const getSubmissionLogDetailBySubmissionId = async (
  submissionId: string
): Promise<SubmissionDetail> => {
  try {
    const { data } = await instance.get<SubmissionDetail>(
      `/v1/problem/assessment/submission/${submissionId}/rank`
    );
    const total = data.ascendingElapsedTimeSeconds.reduce(
      (sum, val) => sum + val,
      0
    );
    const averageElapsedTimeSeconds =
      total / data.ascendingElapsedTimeSeconds.length;
    return { ...data, averageElapsedTimeSeconds };
  } catch (e) {
    if (e instanceof AxiosError) {
      throw e.message;
    }
    throw e;
  }
};

export const getSubmissionResultBySubmissionId = async (
  submissionId: string
): Promise<SubmissionLogItem> => {
  try {
    const { data } = await instance.get<SubmissionLogItem>(
      `/v1/problem/assessment/submission/${submissionId}`
    );

    return data;
  } catch (e) {
    if (e instanceof AxiosError) {
      throw e.message;
    }
    throw e;
  }
};
