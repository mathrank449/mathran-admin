export interface LoginFormData {
  id: string;
  password: string;
  rememberMe: boolean;
}

export type MemberInfo = {
  memberId: string;
  nickName: string;
};

export type Role = "USER" | "ADMIN" | "DEVELOPER"; // 예시, 실제 가능한 역할에 맞춰 수정

export type UserDetailedInfo = {
  nickName: string;
};
