import instance from "../../../shared/apis/instance";

interface LoginResponse {
  accessToken: string;
  userName: string;
}

export const login = async (
  loginId: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const { data } = await instance.post("/v1/auth/login", {
      loginId,
      password,
    });

    return data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const logout = async () => {
  try {
    await instance.post("/v1/auth/logout");
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const refreshToken = async (): Promise<LoginResponse> => {
  try {
    const { data } = await instance.post("/v1/auth/login/refresh");
    return data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
