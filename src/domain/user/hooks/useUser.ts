import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "../../../shared/stores/user";
import { useMutation } from "@tanstack/react-query";
import { instance } from "../../../apis/instance";
import { login, logout } from "../apis/auth";

export const useUser = () => {
  const navigate = useNavigate();

  const userInfo = useAuthStore((state) => state.userInfo);
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogin = useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      console.log("로그인 성공" + JSON.stringify(data));
      instance.defaults.headers.common["Authorization"] = `${data.accessToken}`;
      setAuth(data);

      if (data.isNewUser) {
        alert("첫 회원이라 회원가입을 해야합니다.");
        navigate({ to: "/register" });
      } else {
        alert("로그인에 성공하였습니다.");
        navigate({ to: "/" });
      }
    },
    onError: (error) => {
      alert("로그인에 실패하였습니다." + error.message);
      navigate({ to: "/" });
    },
  });

  const handleLogout = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      console.log("찍힘?");
      clearAuth();
    },
    onError: (error) => {
      console.log("로그아웃 오류" + error.message);
      alert("로그아웃 오류" + error.message);
    },
  });

  return {
    userInfo, // ← 구독 가능
    handleLogin: handleLogin.mutate,
    handleLogout: handleLogout.mutate,
  };
};
