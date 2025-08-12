import instance from "../../../apis/instance";
import type { OauthInfo, RegisterFormData } from "../types/oauth";
import type { UserInfo } from "../types/user";
import axios from "axios";

export const login = async (oauthInfo: OauthInfo): Promise<UserInfo> => {
  try {
    const { data } = await instance.get<UserInfo>(
      `/api/v1/auth/login/oauth/${oauthInfo.provider}?code=${oauthInfo.code}&state=${oauthInfo.state}`
    );
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "OAuth login failed");
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown error occurred during login");
  }
};

export const logout = async () => {
  try {
    await instance.post<UserInfo>(`/api/v1/auth/logout`);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "OAuth login failed");
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown error occurred during login");
  }
};

export const register = async (registerInfo: RegisterFormData) => {
  try {
    const { data } = await instance.put("/api/v1/member/registration", {
      memberType: registerInfo.memberType,
      schoolCodes: [registerInfo.schoolCode],
      agreeToPrivacyPolicy: true,
    });
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "OAuth login failed");
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown error occurred during login");
  }
};
