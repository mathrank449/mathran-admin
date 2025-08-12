export type OauthInfo = {
  provider: "KAKAO" | "google" | "naver";
  code: string;
  state: "1234";
};

export type RegisterFormData = {
  memberType: "TEACHER" | "STUDENT" | "GENERAL";
  nickname: string;
  schoolCode?: string;
  schoolName?: string;
  schoolLocation?: string;
};
