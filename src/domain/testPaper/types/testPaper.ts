import type {
  CourseType,
  DifficultyType,
  ProblemType,
} from "../../problem/types/problem";

export type TestPaperQueryListType = {
  queryType: string;
  testPaperId: string;
  courseInfo: CourseType;
  testPaperName: string;
  difficulty: DifficultyType;
};

// 개별 결과
export type TestPaperResponseItem = {
  assessmentId: string;
  memberId: string;
  assessmentName: string;
  distinctUserCount: number;
  createdAt: string; // ISO8601 문자열
  difficulty: DifficultyType;
  minutes: number;
};

// 응답 전체
export type TestPaperResponse = {
  queryResults: TestPaperResponseItem[];
  currentPageNumber: number;
  currentPageSize: number;
  possibleNextPageNumbers: number[];
};

// 개별 문항
export interface ItemDetail {
  problemId: string;
  problemImage: string;
  memberId: number;
  courseDetailResult: CourseType;
  difficulty: DifficultyType;
  type: ProblemType;
  schoolCode: string;
  createdAt: string; // ISO8601 문자열
  year: number;
}

export type TestPaperDetailedResponse = {
  assessmentId: string;
  itemDetails: ItemDetail[];
  registeredMemberId: number;
  assessmentName: string;
  distinctUserCount: number;
  createdAt: string; // ISO8601 문자열
  difficulty: DifficultyType;
  minutes: number;
};
