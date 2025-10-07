import type { PageInfo } from "../../../../shared/type/Page";
import type {
  CourseType,
  DifficultyType,
  ProblemType,
} from "../../types/problem";

export type ProblemItemResponse = {
  id: string;
  successAtFirstTry: boolean;
  problemId: string;
  singleProblemName: string;
  problemImage: string;
  courseInfo: {
    parents: CourseType[];
    target: CourseType;
  };
  answerType: ProblemType;
  difficulty: DifficultyType;
  firstTrySuccessCount: number;
  totalAttemptedCount: number;
  attemptedUserDistinctCount: number;
  accuracy: number;
};

export interface ProblemListPagination extends PageInfo {
  queryResults: ProblemItemResponse[];
}

export type PastProblemType =
  | ""
  | "HIGH_SCHOOL_1"
  | "HIGH_SCHOOL_2"
  | "HIGH_SCHOOL_3";

export interface SingleProblemQueryListType {
  queryType: "all" | "new" | "popular" | "course" | "school" | "pastProblem";
  singleProblemId: string | "";
  courseInfo: CourseType | undefined;
  singleProblemName: string | "";
  answerType: ProblemType | undefined;
  difficulty: DifficultyType | "";
  pastProblem: PastProblemType;
}

export type SubmitAnswerResponse = {
  success: boolean | undefined; // 제출 성공 여부
  realAnswer: string[]; // 정답 목록
  submittedAnswer: string[]; // 사용자가 제출한 답안 목록
};

// 정답 데이터 타입 정의
export type SingleProblemSolution = {
  imageSource: string; // 문제 이미지 경로 (또는 원본 이미지)
  path: string; // 문제 경로 또는 식별용 경로
  difficulty: DifficultyType; // 난이도
  type: ProblemType; // 문제 유형
  pastProblem: PastProblemType; // 기출 여부
  answer: string[]; // 정답 배열 (객관식, 주관식 공통)
  createdAt: string; // 생성일
  year: number; // 연도
  solutionVideoLink: string; // 풀이 영상 링크
  solutionImage: string; // 풀이 이미지 (해설 이미지)
};
