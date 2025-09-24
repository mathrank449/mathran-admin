import type { UserDetailedInfo } from "../types/user";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface AuthState {
  isLogin: boolean | null;
  userInfo: UserDetailedInfo | null; // UserType은 유저 정보 타입으로 대체하세요
  setAuth: (userInfo: UserDetailedInfo) => void;
  clearAuth: () => void;
}

/* 매개변수: stateCreator
stateCreator는 set, get, store를 매개변수로 받는 함수이다.
각각의 set, get, store역시 함수이다. 
set: 상태를 업데이트하는 함수
get: 상태를 조회하는 함수
store: 상태를 저장하는 함수
라 가정하고 리턴하고자 하는 객체 내부에서 사용

stateCreator는 저장하고자 하는 상태의 초기값(객체)를 반환 
*/
export const useAuthStore = create<AuthState>()(
  subscribeWithSelector((set) => ({
    isLogin: null,
    userInfo: null,
    setAuth: (userInfo) => set({ isLogin: true, userInfo }),
    clearAuth: () => set({ isLogin: false, userInfo: null }),
  }))
);
/* 리턴값은 useBoundStore 훅으로 매개변수인 선택자(selector)로 선택한 값이 반환된다.

ex)
const setAuth = useAuthStore((state) => state.setAuth);
const clearAuth = useAuthStore((state) => state.clearAuth);
 */
