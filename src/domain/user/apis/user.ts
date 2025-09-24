import { AxiosError } from "axios";
import instance from "../../../shared/apis/instance";
import type { UserDetailedInfo } from "../types/user";

export const getUserInfo = async (): Promise<UserDetailedInfo> => {
  try {
    const { data } = await instance.get<UserDetailedInfo>("/v1/member/info/my");
    return data;
  } catch (e) {
    if (e instanceof AxiosError) {
      // e.response?.data가 있으면 서버 에러 메시지 반환
      throw e.response?.data ?? e.message;
    }
    throw e;
  }
};
