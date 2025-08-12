import axios from "axios";
import { useAuthStore } from "../shared/stores/user";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const instance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  withCredentials: true, // logout을 위해
});

export const loginInstance = axios.create({
  baseURL: baseURL,
  timeout: 1000,
  withCredentials: true, // http-only 쿠키를 받기 위해
});

// 응답 인터셉터 (에러 핸들링 포함)
instance.interceptors.response.use(
  (response) => response, // 응답 성공 시 그대로 반환
  async (error) => {
    const originalRequest = error.config;

    // 네트워크 에러 처리
    if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
      // window.location.href = '/network-error'; // 네트워크 에러 페이지로 이동
      return Promise.reject(error);
    }

    // 요청 취소 처리
    if (error.code === "ERR_CANCELED" || error.message === "canceled") {
      window.location.href = "/server-error"; // 요청 취소 페이지로 이동
      return Promise.reject(error);
    }

    // AccessToken 만료로 인한 에러 처리
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // 무한 재요청 방지

      try {
        const response = await loginInstance.post("/api/v1/auth/login/refresh");

        const newToken = response.data.accessToken;
        instance.defaults.headers.common.Authorization = newToken;
        useAuthStore.getState().setAuth(response.data);
        originalRequest.headers.Authorization = newToken;
        return instance(originalRequest); // 요청 재시도
      } catch (refreshError) {
        window.location.href = "/login"; // 요청 취소 페이지로 이동
        return Promise.reject(refreshError); // 갱신 실패 시 에러 반환
      }
    }

    return Promise.reject(error); // 다른 에러는 그대로 반환
  }
);

export default instance;
