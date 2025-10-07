import type { PageInfo } from "../../../shared/type/Page";

export type ResourceType = "testPaper" | "schoolPaper" | "video";

// 질문 글 타입 정의
export type ResourceItemType = {
  resourceId: string;
  memberId: string;
  memberNickName: string;
  resourceType: ResourceType;
  title: string;
  price: number;
  createdAt: string; // ISO 날짜 문자열
};

export interface ResourcesResponsePagination extends PageInfo {
  queryResults: ResourceItemType[];
}
