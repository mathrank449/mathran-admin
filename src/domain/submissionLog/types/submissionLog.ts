export type SubmissionLogProblemItemResult = {
  problemId: number;
  score: number;
  correct: boolean;
  sequence: number;
  submittedAnswer: string[];
  correctAnswer: string[];
};

export type SubmissionLogItem = {
  submissionId: string;
  assessmentId: number;
  assessmentAverageScore: number;
  memberId: number;
  evaluationStatus: "PENDING" | "COMPLETED" | "FAILED"; // 필요한 상태들을 union으로 확장 가능
  totalScore: number;
  itemSubmissionResults: SubmissionLogProblemItemResult[];
  submittedAt: string; // ISO 날짜 문자열
  elapsedTimeSeconds: number;
};

export type SubmissionDetail = {
  descendingScores: number[]; // 점수 내림차순 배열
  score: number; // 내 점수
  scoreRank: number; // 점수 순위
  ascendingElapsedTimeSeconds: number[]; // 풀이 시간 오름차순 배열
  elapsedTimeSeconds: number; // 내 풀이 시간
  averageElapsedTimeSeconds: number;
  elapsedTimeRank: number; // 풀이 시간 순위
  totalUserCount: number; // 랭킹 전체 유저
};
