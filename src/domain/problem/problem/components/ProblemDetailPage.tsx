import { useEffect, useState } from "react";
import { getSingleProblemById, solveSingleProblem } from "../apis/problem";
import type {
  ProblemItemResponse,
  SubmitAnswerResponse,
} from "../types/problem";
import { AiOutlineCopy } from "react-icons/ai";
import { difficultyToKorean } from "../../utils/difficultyTransform";
import { problemTypeToKorea } from "../../utils/problemTypeToKorea";
import ChallengeLogItem from "../../../challengeLog/components/ChallengeLogItem";
import ChallengeLogHeader from "../../../challengeLog/components/ChallengeLogHeader";
import type {
  ChallengeLog,
  ChallengeLogDetail,
} from "../../../challengeLog/types/challengeLog";
import { getChallengeLogsBySingleProblemId } from "../../../challengeLog/apis/challengeLog";
const baseURL = import.meta.env.VITE_API_BASE_URL;

interface ProblemDetailPageProps {
  problemId: string | number;
}

function ProblemDetailPage({ problemId }: ProblemDetailPageProps) {
  const [problem, setProblem] = useState<ProblemItemResponse | null>(null);
  const [challengeLogs, setChallengeLogs] = useState<ChallengeLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<number | undefined>(undefined);
  const [detailedLog, setDetailedLog] = useState<
    ChallengeLogDetail | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [answers, setAnswers] = useState<string[]>([""]); // 여러 정답 관리
  const [startTime, setStartTime] = useState(0);

  const [isModify, setIsModify] = useState(false);
  const [modificationTitle, setModificationTitle] = useState("");

  const [submissionResult, setSubmissionResult] =
    useState<SubmitAnswerResponse>({
      success: undefined, // 제출 성공 여부
      realAnswer: [], // 정답 목록
      submittedAnswer: [], // 사용자가 제출한 답안 목록
    });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const preoblemDetailedRes = await getSingleProblemById(String(problemId));
      setStartTime(Date.now());
      setProblem(preoblemDetailedRes);
      setModificationTitle(preoblemDetailedRes.singleProblemName);

      const challengeLogsResponse = await getChallengeLogsBySingleProblemId(
        String(problemId)
      );
      setChallengeLogs(challengeLogsResponse);
      setIsLoading(false);
    };
    fetchData();
  }, [problemId]);

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const addAnswerField = () => setAnswers([...answers, ""]);
  const removeAnswerField = (index: number) => {
    const newAnswers = answers.filter((_, i) => i !== index);
    setAnswers(newAnswers);
  };

  if (isLoading) return <div>로딩중...</div>;
  if (!problem) return <div>문제를 불러올 수 없습니다.</div>;

  return (
    <div className="flex justify-center mt-24 mr-8">
      <div className="p-4 flex flex-col gap-4 relative mb-36 ml-8 border-solid border-gray-200 rounded-xl border-1 shadow-sm">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              {isModify ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    className="font-bold border rounded px-2 py-1 w-full max-w-xs"
                    value={modificationTitle}
                    onChange={(e) => setModificationTitle(e.target.value)}
                  />
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition whitespace-nowrap cursor-pointer"
                    onClick={() => {
                      // 수정 API 쏘고 성공하면 제목 데이터 교체
                    }}
                  >
                    완료
                  </button>
                  <button
                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded shadow hover:bg-gray-400 transition whitespace-nowrap cursor-pointer"
                    onClick={() => {
                      setIsModify(false);
                    }}
                  >
                    취소
                  </button>
                </div>
              ) : (
                <span className="font-bold mr-4">
                  {problem.id}. {problem.singleProblemName}
                </span>
              )}
              <span>
                {problem.successAtFirstTry === true && (
                  <span className="text-md px-3 py-1 rounded-xl border-solid border border-blue-500 bg-blue-500 text-white">
                    성공
                  </span>
                )}
                {problem.successAtFirstTry === false && (
                  <span className="text-md px-3 py-1 rounded-xl border-solid border border-red-500 bg-red-500 text-white">
                    실패
                  </span>
                )}
              </span>
            </div>
            <button
              className="text-blue-600 text-md hover:text-blue-800 cursor-pointer"
              onClick={() => {
                window.location.href = `/solution-board/${problem.id}`;
              }}
            >
              풀이 게시판 보기
            </button>
          </div>
          <hr />
        </div>

        <div className="mb-8 border-b-2 border-black pb-3">
          <span className="font-bold mb-8 border-b-3 border-blue-400 pb-3">
            문제
          </span>
        </div>

        <section className="relative w-[540px] mb-4 ml-[20px]">
          <div className="flex py-4">
            <div className="mr-12 flex flex-col gap-2 ml-4 items-center">
              <AiOutlineCopy size={24} className="mb-2 cursor-pointer" />
              <span className="text-md text-blue-400 px-2 font-bold rounded-lg bg-gray-100 text-center">
                {difficultyToKorean(problem.difficulty)}
              </span>
              <span className="text-md text-gray-500 px-2 font-bold rounded-lg bg-gray-100 text-center">
                {problemTypeToKorea(problem.answerType)}
              </span>
            </div>
            <img
              className="h-46"
              src={`${baseURL}/v1/image?imageSource=${problem.problemImage}`}
              alt="문제 이미지"
            />
          </div>
        </section>

        {/* 정답 입력 */}
        <div className="flex flex-col gap-2 mt-4">
          <span className="font-bold">정답 입력</span>
          {answers.map((answer, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="text"
                value={answer}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 w-full"
                placeholder={`정답 ${index + 1}`}
              />
              {answers.length > 1 && (
                <button
                  type="button"
                  className="text-red-500 font-bold w-24 cursor-pointer"
                  onClick={() => removeAnswerField(index)}
                >
                  삭제
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="mt-2 px-4 py-1 bg-green-500 text-white rounded cursor-pointer"
            onClick={addAnswerField}
          >
            정답 추가
          </button>
        </div>

        <div className="flex gap-4 absolute bottom-[-60px] right-0">
          <button
            onClick={async () => {
              setIsLoading(true); // 호출 전 로딩 시작
              try {
                const elapsedTimeSeconds = Math.floor(
                  (Date.now() - startTime) / 1000
                );
                // 정답 제출
                const solvingResult = await solveSingleProblem(
                  problem.id,
                  answers,
                  elapsedTimeSeconds
                );
                setSubmissionResult(solvingResult);

                // 문제 정보 새로 가져오기
                const updatedProblem = await getSingleProblemById(
                  String(problemId)
                );
                setProblem(updatedProblem);

                // 풀이 이력 재 조회
                const challengeLogsResponse =
                  await getChallengeLogsBySingleProblemId(String(problemId));
                setChallengeLogs(challengeLogsResponse);

                setStartTime(Date.now());
              } catch (error) {
                console.error(error);
              } finally {
                setIsLoading(false); // 호출 끝나면 로딩 종료
              }
            }}
            className="cursor-pointer bg-blue-600 px-6 py-1 text-white text-md rounded-md w-auto"
          >
            제출
          </button>
          <button
            onClick={async () => {
              setIsModify(true);
            }}
            className="cursor-pointer bg-blue-600 px-6 py-1 text-white text-md rounded-md w-auto"
          >
            수정
          </button>
          <button
            onClick={async () => {}}
            className="cursor-pointer bg-blue-600 px-6 py-1 text-white text-md rounded-md w-auto"
          >
            삭제
          </button>
        </div>
      </div>
      <div className="ml-8">
        <div className="border-solid border-gray-200 rounded-xl border-1 shadow-sm h-[400px] overflow-y-auto">
          {selectedLog === undefined ? (
            <div>
              <ChallengeLogHeader />
              {challengeLogs.map((challengeLog, index) => (
                <ChallengeLogItem
                  key={challengeLog.challengeLogId}
                  challengeLog={challengeLog}
                  index={index}
                  setSelectedLog={setSelectedLog}
                  setDetailedLog={setDetailedLog}
                />
              ))}
            </div>
          ) : (
            detailedLog && (
              <div className="relative w-[500px] rounded-2xl bg-white p-6">
                {/* 닫기 버튼 */}
                <button
                  className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition cursor-pointer"
                  onClick={() => {
                    setSelectedLog(undefined);
                  }}
                >
                  ✕
                </button>

                {/* 로그 내용 */}
                <div className="flex flex-col gap-4 mt-8">
                  {/* 랭킹 */}
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-700">
                      내 순위
                    </span>
                    {detailedLog.myRank === null ? (
                      <span className="text-xl font-bold text-red-600">
                        등수 없음
                      </span>
                    ) : (
                      <span className="text-xl font-bold text-blue-600">
                        {detailedLog.myRank}/{detailedLog.totalUserCount}
                      </span>
                    )}
                  </div>

                  {/* 걸린 시간 */}
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-700">
                      소요 시간
                    </span>
                    <span className="text-xl text-green-600">
                      {detailedLog.myElapsedTimeSecond}초
                    </span>
                  </div>

                  {/* 평균 시간 */}
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-700">
                      평균 소요 시간
                    </span>
                    <span className="text-xl text-gray-800">
                      {detailedLog.averageElapsedTimeSecond}초
                    </span>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
        {/* 결과 표시 */}
        <div className="mt-4">
          <div className="border-solid border-gray-200 rounded-xl border-1 shadow-sm h-[188px]">
            <div className="text-center my-2">
              <span className="font-bold">제출 결과</span>
            </div>
            {submissionResult.success !== undefined && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-bold mb-2">결과</h3>
                <p>
                  <span className="font-bold">내 정답:</span>{" "}
                  {submissionResult.submittedAnswer.join(", ")}
                </p>
                <p>
                  <span className="font-bold">실제 정답:</span>{" "}
                  {submissionResult.realAnswer.join(", ")}
                </p>
                <p
                  className={`font-bold mt-2 ${
                    submissionResult.success ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {submissionResult.success ? "정답입니다 ✅" : "오답입니다 ❌"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemDetailPage;
