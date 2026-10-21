import { AxiosError } from "axios";
import instance from "../../../../shared/apis/instance";
import {
  type ContestDraft,
  toContestRegisterPayload,
} from "../services/contestDraft";

export const enrollContest = async (draft: ContestDraft): Promise<void> => {
  try {
    await instance.post("/v1/problem/contest", toContestRegisterPayload(draft));
  } catch (e) {
    if (e instanceof AxiosError) {
      throw new Error(e.response?.data?.message ?? e.message);
    }
    throw e;
  }
};
