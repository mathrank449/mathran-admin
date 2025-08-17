import axios from "axios";
import { refreshToken } from "../../domain/user/apis/auth";

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  throw new Error("VITE_API_BASE_URL is not set. Please check your .env file.");
}

const API_TIMEOUT = 5000;

const instance = axios.create({
  baseURL,
  timeout: API_TIMEOUT,
  withCredentials: true,
});

type FailedRequest = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error || token === null) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      if (originalRequest._retry) {
        // 이미 재시도 했는데도 401 -> 로그인 페이지로 이동
        localStorage.removeItem("mathrancloud_username");
        window.location.href = "/login"; // 로그인 페이지 경로에 맞게 수정하세요
        return Promise.reject(error);
      }

      // _retry가 없으면 refresh 시도
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers["Authorization"] = token;
          return instance(originalRequest);
        });
      }

      isRefreshing = true;
      try {
        const data = await refreshToken();
        const newToken = data.accessToken;

        instance.defaults.headers.common["Authorization"] = newToken;
        localStorage.setItem("mathrancloud_username", data.userName);
        processQueue(null, newToken);

        originalRequest.headers["Authorization"] = newToken;
        return instance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem("mathrancloud_username");
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
