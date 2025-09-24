import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "../stores/authStore";

export const verifyAuth = async ({
  timeoutMs = 3000,
}: { timeoutMs?: number } = {}) => {
  // 초기 상태 검사
  const initialLogin = useAuthStore.getState().isLogin;
  if (initialLogin === true) return;
  if (initialLogin === false) {
    alert("로그인이 필요합니다");
    throw redirect({ to: "/", search: { redirect: window.location.pathname } });
  }

  await new Promise<void>((resolve, reject) => {
    let isDone = false; // 이미 처리 했는지 여부, 중복 실행 방지를 위한 플래그
    let timerId: ReturnType<typeof setTimeout> | undefined;

    // 로그인 상태 구독
    const unsubscribeAuth = useAuthStore.subscribe(
      (state) => state.isLogin,
      // 콜백 함수를 통해 타이머 종료
      (currentLoginstate) => {
        if (isDone) return; // 이미 처리 했거나 로그인 상태가 없으면 종료
        isDone = true;

        // 타이머 종료, 구독 해제, Resolve or Reject 처리
        if (timerId) clearTimeout(timerId);
        unsubscribeAuth();
        if (currentLoginstate === true) resolve();
        else {
          alert("로그인이 필요합니다");
          reject(new Error("unauth"));
        }
      }
    );

    timerId = setTimeout(() => {
      // timeoutMs 안에 처리되지 못한 경우 timeout 에러
      if (isDone) return;
      isDone = true;
      unsubscribeAuth();
      alert("로그인 시간이 초과되었습니다.");
      reject(new Error("timeout"));
    }, timeoutMs);
  }).catch(() => {
    throw redirect({ to: "/", search: { redirect: window.location.pathname } });
  });
};
