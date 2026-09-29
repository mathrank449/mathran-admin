import { AxiosError } from "axios";
import instance from "../../../../shared/apis/instance";
import {
  type AssessmentPdfDraft,
  parseAssessmentId,
  toAssessmentRegisterPayload,
} from "../types/assessmentPdf";

export const enrollTestPapers = async (
  draft: AssessmentPdfDraft
): Promise<string> => {
  try {
    const { data } = await instance.post<unknown>(
      "/v1/problem/assessment",
      toAssessmentRegisterPayload(draft)
    );
    return parseAssessmentId(data);
  } catch (e) {
    if (e instanceof AxiosError) {
      throw new Error(e.response?.data?.message ?? e.message);
    }
    throw e;
  }
};
