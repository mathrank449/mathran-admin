import type { PageInfo } from "../../../shared/type/Page";
import type { PostType } from "../type/solutionBoard";

// 질문 글 타입 정의
export type QuestionPostItem = {
  postId: string;
  memberId: string;
  memberNickName: string;
  postType: PostType;
  title: string;
  singleProblemId: string;
  assessmentId: string;
  contestId: string;
  commentCount: number;
  createdAt: string; // ISO 날짜 문자열
};

export interface QuestionPostsResponsePagination extends PageInfo {
  queryResults: QuestionPostItem[];
}
