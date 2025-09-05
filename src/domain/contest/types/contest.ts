import type {
  CourseType,
  DifficultyType,
  ProblemType,
} from "../../problem/types/problem";

export type ContestQueryListType = {
  queryType: string;
  contestId: string;
  contestName: string;
  difficulty: DifficultyType;
};

// 개별 결과
export type ContestResponseItem = {
  contestId: string;
  memberId: string;
  contestName: string;
  distinctUserCount: number;
  createdAt: string; // ISO8601 문자열
  difficulty: DifficultyType;
  minutes: number;
  startAt: string;
  endAt: string;
};

export type ContestDetailedResponse = {
  contestId: string;
  itemDetails: ItemDetail[];
  memberId: number;
  contestName: string;
  distinctUserCount: number;
  createdAt: string; // ISO8601 문자열
  difficulty: DifficultyType;
  minutes: number;
  startAt: string;
  endAt: string;
};

// 개별 문항
export interface ItemDetail {
  problemId: string;
  problemImage: string;
  memberId: number;
  score: number;
  courseDetailResult: CourseType;
  difficulty: DifficultyType;
  type: ProblemType;
  schoolCode: string;
  createdAt: string; // ISO8601 문자열
  year: number;
}

// 응답 전체
export type ContestResponse = {
  queryResults: ContestResponseItem[];
  currentPageNumber: number;
  currentPageSize: number;
  possibleNextPageNumbers: number[];
};
