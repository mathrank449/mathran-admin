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
