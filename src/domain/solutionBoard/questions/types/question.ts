import type { MemberInfo } from "../../../user/types/user";
import type { PostType } from "../../type/solutionBoard";

// 질문 글 타입 정의
export type Question = {
  postId: string;
  memberInfo: MemberInfo;
  postType: PostType;
  title: string;
  content: string;
  comments: Comment[];
  singleProblemId?: string;
  assessmentId?: string;
  contestId?: string;
  createdAt: string; // ISO 날짜 문자열
};

export type Comment = {
  commentId: string;
  memberInfo: MemberInfo;
  content: string;
  createdAt: string;
};
