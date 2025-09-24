export type PostType =
  | "FREE"
  | "CONTEST"
  | "ASSESSMENT"
  | "SINGLE_PROBLEM"
  | "NOTICE";

export type SolutionBoardQuery = {
  postId?: string;
  memberId?: string;
  nickName?: string;
  postType?: PostType;
  title?: string;
  singleProblemId?: string;
  assessmentId?: string;
  contestId?: string;
};

export type PostSolutionType = {
  postType: PostType;
  title: string;
  content: string;
  problemId?: string;
  assessmentId?: string;
  contestId?: string;
};

export type ModifySolutionType = {
  title: string;
  content: string;
};
