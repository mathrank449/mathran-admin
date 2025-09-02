export type ChallengeLog = {
  challengeLogId: string;
  success: boolean;
  submittedAt: string;
  elapsedTimeSeconds: number;
  submittedAnswer: string[];
  correctAnswer: string[];
};

export type ChallengeLogDetail = {
  totalUserCount: number; // 전체 제출자 수
  myRank: number; // 내 순위
  myElapsedTimeSecond: number; // 내 풀이 시간
  elapsedTimeSeconds: number[]; // 전체 제출자들의 풀이 시간 목록
  averageElapsedTimeSecond: number; // 평균 풀이 시간
};
