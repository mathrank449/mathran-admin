import { AxiosError } from "axios";
import instance from "../../../shared/apis/instance";
import type { RankInfoPagination, UserRankInfo } from "../types/rank";

export const getRankByMemberId = async (
  memberId: string
): Promise<UserRankInfo> => {
  try {
    const { data } = await instance.get(`/v1/rank?memberId=${memberId}`);

    return data;
  } catch (e) {
    if (e instanceof AxiosError) {
      throw e.message;
    }
    throw e;
  }
};

export const getRankAll = async (page: number): Promise<RankInfoPagination> => {
  try {
    const { data } = await instance.get(
      `/v1/rank/all?pageSize=10&pageNumber=${page}`
    );

    return data;
  } catch (e) {
    if (e instanceof AxiosError) {
      throw e.message;
    }
    throw e;
  }
};
