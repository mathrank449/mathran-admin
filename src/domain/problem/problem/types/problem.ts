import type {
  CourseType,
  DifficultyType,
  ProblemType,
} from "../../types/problem";

export type ProblemItemResponse = {
  id: string;
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

export type SingleProblemQueryListType = {
  queryType: "all" | "new" | "popular" | "course" | "school";
  singleProblemId: string | "";
  courseInfo: CourseType | undefined;
  singleProblemName: string | "";
  answerType: ProblemType | undefined;
  difficulty: DifficultyType | "";
};
