import { useEffect, useState } from "react";
import type { TestPaperDetailedResponse } from "../types/testPaper";
import {
  deleteTestPaperById,
  getTestPapersById,
  getTestPaperSolutionById,
  modifyTestPaperById,
  submitTestPapersByTestPaperId,
} from "../apis/testPaper";
import { AiOutlineCopy } from "react-icons/ai";
import { difficultyMap, problemMap } from "../../problem/utils/problemMap";
import {
  getSubmissionLogsByAssessmentId,
  getSubmissionResultBySubmissionId,
} from "../../submissionLog/apis/submissionLog";
import type {
  SubmissionDetail,
  SubmissionLogItem,
} from "../../submissionLog/types/submissionLog";
import SubmissionLogListItem from "../../submissionLog/components/SubmissionLogListItem";
import SubmissionLogHeader from "../../submissionLog/components/SubmissionLogHeader";
import SubmissionResultListHeader from "./SubmissionResultListHeader";
import SubmissionResultByProblem from "./SubmissionResultByProblem";
import { useNavigate } from "@tanstack/react-router";
import type { ProblemSolution } from "../../problem/problem/types/problem";

const baseURL = import.meta.env.VITE_API_BASE_URL;

function TestPaperDetailedPage({ testPaperId }: { testPaperId: string }) {
  const navigate = useNavigate();
  const [testPaper, setTestPaper] = useState<TestPaperDetailedResponse | null>(
    null
  );
  // 여러 문제의 여러 정답을 관리 (2차원 배열)
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isModify, setIsModify] = useState(false);
  const [modificationTitle, setModificationTitle] = useState("");
  const [solution, setSolution] = useState<ProblemSolution[] | undefined>(
    undefined
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!testPaper) return; // 아직 로딩 중이면 return
    const timeLimitSeconds = testPaper.minutes * 60;

    // 제한시간을 넘었고 아직 제출 결과가 없다면 자동 제출
    if (elapsedTime >= timeLimitSeconds && !submissionResult) {
      alert("제한 시간이 지나 현재 푼 부분까지 채점을 합니다.");
      const autoSubmit = async () => {
        try {
          const submittedLogId = await submitTestPapersByTestPaperId(
            testPaperId,
            answers,
            elapsedTime
          );

          const submissionLogDetailResponse =
            await getSubmissionResultBySubmissionId(submittedLogId);

          setElapsedTime(0);
          setSubmissionResult(submissionLogDetailResponse);

          const submissionLogsResponse = await getSubmissionLogsByAssessmentId(
            String(testPaperId)
          );

          setSubmissionLogs(submissionLogsResponse);
        } catch (e) {
          console.error("자동 제출 실패:", e);
        }
      };

      autoSubmit();
    }
  }, [elapsedTime]);

  const [answers, setAnswers] = useState<string[][]>([[""]]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [submissionLogs, setSubmissionLogs] = useState<SubmissionLogItem[]>([]);
  const [detailedSubmission, setDetailedSubmission] = useState<
    SubmissionDetail | undefined
  >(undefined);

  const [selectedLog, setSelectedLog] = useState<number | undefined>(undefined);
  const [submissionResult, setSubmissionResult] = useState<
    SubmissionLogItem | undefined
  >(undefined);
  useEffect(() => {
    const fetchTestPaper = async () => {
      const testPaperResponse = await getTestPapersById(String(testPaperId));
      setTestPaper(testPaperResponse);
      setModificationTitle(testPaperResponse.assessmentName);

      // itemDetails 개수만큼 정답 배열 초기화 (예: [[""], [""], ...])
      const initialAnswers = testPaperResponse.itemDetails.map(() => [""]);
      setAnswers(initialAnswers);

      const submissionLogsResponse = await getSubmissionLogsByAssessmentId(
        String(testPaperId)
      );

      setSubmissionLogs(submissionLogsResponse);
      setElapsedTime(0);
      const testPaperSolutionRes = await getTestPaperSolutionById(
        String(testPaperId)
      );
      setSolution(testPaperSolutionRes);
    };

    fetchTestPaper();
  }, [testPaperId]);

  if (testPaper === null) return <div>데이터 없음</div>;

  const problem = testPaper.itemDetails[selectedIndex];

  // 특정 문제의 특정 정답 수정
  const updateAnswer = (
    problemIndex: number,
    answerIndex: number,
    value: string
  ) => {
    setAnswers((prev) =>
      prev.map((arr, idx) =>
        idx === problemIndex
          ? arr.map((ans, i) => (i === answerIndex ? value : ans))
          : arr
      )
    );
  };

  const removeAnswerField = (problemIndex: number, answerIndex: number) => {
    setAnswers((prev) =>
      prev.map((arr, pIdx) =>
        pIdx === problemIndex
          ? arr.filter((_, aIdx) => aIdx !== answerIndex)
          : arr
      )
    );
  };

  // 특정 문제에 새 정답 배열 추가 (새 문제 등록 시)
  const addAnswer = (problemIndex: number) => {
    setAnswers((prev) =>
      prev.map((arr, pIdx) => (pIdx === problemIndex ? [...arr, ""] : arr))
    );
  };

  return (
    <div className="flex justify-center mt-24 mr-8">
      {/* 상단 타이머 */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
        <div className="bg-white shadow-lg rounded-full px-6 py-2 flex items-center gap-3 border border-gray-200">
          <span className="text-sm font-medium text-gray-500">⏱ 경과 시간</span>
          <span className="text-lg font-extrabold text-blue-600">
            {String(Math.floor(elapsedTime / 60)).padStart(2, "0")}:
            {String(elapsedTime % 60).padStart(2, "0")}
          </span>
        </div>
      </div>
      <div className="shadow-sm p-4 border-solid border-gray-200 rounded-xl border-1">
        <div className="absolute left-4 top-24 z-5">
          <nav className="text-center  h-128 overflow-y-auto bg-gray-50 shadow-md rounded-xl mb-6 px-8">
            {Array.from({ length: testPaper.itemDetails.length }, (_, i) => {
              const isSelected = i === selectedIndex; // 현재 선택된 버튼
              return (
                <button
                  key={i}
                  className={`block my-3 mx-auto
              cursor-pointer px-3 py-2 rounded-lg shadow transition text-left
              ${
                isSelected
                  ? "bg-blue-500 text-white"
                  : "bg-white hover:bg-blue-50"
              }
            `}
                  onClick={() => setSelectedIndex(i)}
                >
                  문제 {i + 1}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-8 ">
          <button
            className="cursor-pointer w-10 h-10 flex items-center justify-center 
               rounded-full border border-gray-300 shadow-md 
               hover:bg-blue-500 hover:text-white 
               transition-colors duration-200"
            onClick={() => {
              if (0 > selectedIndex - 1) {
                alert("이전 문제가 없습니다.");
                return;
              }
              setSelectedIndex((prev) => prev - 1);
            }}
          >
            <span className="text-xl">&lt;</span>
          </button>

          <div className="p-4 flex flex-col relative mb-2">
            {/* 제목 입력창 */}
            <div className="flex justify-between gap-4 items-center pb-3">
              {/* 문서 제목 */}
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
                    onClick={async () => {
                      try {
                        await modifyTestPaperById(
                          testPaperId,
                          modificationTitle
                        );
                        alert("문제집 이름이 수정되었습니다.");
                        const testPaperResponse = await getTestPapersById(
                          String(testPaperId)
                        );
                        setTestPaper(testPaperResponse);
                        setIsModify(false);
                      } catch (e) {
                        alert("문제집 이름 수정에 실패하였습니다.");
                        console.log(e);
                      }
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
                  {testPaper.assessmentId}. {testPaper.assessmentName}
                </span>
              )}
              <div className="flex items-center gap-4">
                <button
                  className="text-blue-600 text-md hover:text-blue-800 cursor-pointer"
                  onClick={() => {
                    window.location.href = `/solution-board/question/testPaper/${testPaper.assessmentId}`;
                  }}
                >
                  질문 게시판 보기
                </button>
                {/* 시간 제한 */}
                <div className="flex items-center gap-1">
                  <span className="text-sm">시간제한/</span>
                  <span className="focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md text-center mx-1">
                    {testPaper.minutes}
                  </span>
                  <span className="text-sm">분</span>
                </div>
              </div>
            </div>

            <hr />

            <div className="flex justify-between gap-4 items-center border-b-2 border-black my-4">
              <div className="pb-3 focus:outline-none focus:ring-2 focus:ring-blue-400 px-2 rounded-md ">
                {submissionResult === undefined ? (
                  <span className="font-bold mb-8 border-b-3 border-blue-400 pb-3">
                    {selectedIndex + 1}번 문제
                  </span>
                ) : submissionResult.itemSubmissionResults[selectedIndex]
                    .correct === true ? (
                  <span className="font-bold mb-8 border-b-3 border-blue-400 pb-3 text-blue-500">
                    {selectedIndex + 1}번 문제
                    <span className="ml-2 text-md px-3 py-1 rounded-xl border-solid border border-blue-500 bg-blue-500 text-white">
                      정답
                    </span>
                  </span>
                ) : (
                  <span className="font-bold mb-8 border-b-3 border-red-400 pb-3 text-red-500">
                    {selectedIndex + 1}번 문제
                    <span className="ml-2 text-md px-3 py-1 rounded-xl border-solid border border-red-500 bg-red-500 text-white">
                      오답
                    </span>
                  </span>
                )}
              </div>

              <div className="flex justify-between gap-4">
                {/* 오른쪽: 풀이 영상 링크 (solution에서 불러옴) */}
                {solution && solution[selectedIndex].solutionVideoLink && (
                  <a
                    href={solution[selectedIndex].solutionVideoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 font-semibold transition-colors"
                  >
                    풀이 영상 보기 🎥
                  </a>
                )}
                {/* 시간 제한 */}
                <div className="flex items-center gap-1">
                  <span className="text-md">점수/</span>
                  <span className="text-md focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md text-center">
                    {testPaper?.itemDetails[selectedIndex].score}
                  </span>
                  <span className="text-sm">점</span>
                </div>
              </div>
            </div>

            <section className="w-[540px] mb-4">
              <div className="flex py-4 justify-center">
                <div className="mr-12 flex flex-col gap-2 items-center">
                  <AiOutlineCopy size={24} className="mb-2 cursor-pointer" />
                  <span className="text-md text-blue-400 px-2 font-bold rounded-lg bg-gray-100 text-center">
                    {difficultyMap[problem.difficulty]}
                  </span>
                  <span className="text-md text-gray-500 px-2 font-bold rounded-lg bg-gray-100 text-center">
                    {problemMap[problem.type]}
                  </span>
                </div>
                <img
                  className="h-64"
                  src={`${baseURL}/v1/image?imageSource=${problem.problemImage}`}
                  alt="문제 이미지"
                />
              </div>
            </section>
          </div>

          <button
            className="cursor-pointer w-10 h-10
               rounded-full border border-gray-300 shadow-md 
               hover:bg-blue-500 hover:text-white 
               transition-colors duration-200"
            onClick={() => {
              if (selectedIndex + 1 > testPaper.itemDetails.length - 1) {
                alert("다음 문제가 없습니다.");
                return;
              }
              setSelectedIndex(selectedIndex + 1);
            }}
          >
            <span className="text-xl">&gt;</span>
          </button>
        </div>
        {/* 정답 입력 */}
        <div className="flex flex-col gap-4 mt-4">
          <span className="font-bold">정답 입력</span>
          {answers[selectedIndex].map((answer, answerIndex) => (
            <div className="flex gap-2 items-center" key={answerIndex}>
              <input
                type="text"
                value={answer}
                onChange={(e) =>
                  updateAnswer(selectedIndex, answerIndex, e.target.value)
                }
                className="border border-gray-300 rounded px-2 py-1 w-full"
                placeholder={`정답 ${answerIndex + 1}`}
              />
              {answers[selectedIndex].length > 1 && (
                <button
                  type="button"
                  className="text-red-500 font-bold w-24 cursor-pointer"
                  onClick={() => removeAnswerField(selectedIndex, answerIndex)}
                >
                  삭제
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          className="mt-2 px-4 py-1 bg-green-500 text-white rounded cursor-pointer"
          onClick={() => addAnswer(selectedIndex)}
        >
          정답 추가
        </button>

        <div className="text-right mt-12">
          <button
            onClick={async () => {
              try {
                const submittedLogId = await submitTestPapersByTestPaperId(
                  testPaperId,
                  answers,
                  elapsedTime
                );

                let submissionLogDetailResponse =
                  await getSubmissionResultBySubmissionId(submittedLogId);

                // 상태가 PENDING이면 1초 대기 후 재요청
                if (
                  submissionLogDetailResponse.evaluationStatus === "PENDING"
                ) {
                  await new Promise((resolve) => setTimeout(resolve, 1000));
                  submissionLogDetailResponse =
                    await getSubmissionResultBySubmissionId(submittedLogId);
                }

                setSubmissionResult(submissionLogDetailResponse);
                setElapsedTime(0);

                const submissionLogsResponse =
                  await getSubmissionLogsByAssessmentId(String(testPaperId));

                setSubmissionLogs(submissionLogsResponse);

                const testPaperSolutionRes = await getTestPaperSolutionById(
                  String(testPaperId)
                );
                setSolution(testPaperSolutionRes);
              } catch (e) {
                console.log(e);
              }
            }}
            className="cursor-pointer bg-blue-600 px-6 py-1 text-white text-md rounded-md w-auto mr-4"
          >
            제출
          </button>
          <button
            onClick={async () => {
              setIsModify(true);
            }}
            className="cursor-pointer bg-blue-600 px-6 py-1 text-white text-md rounded-md w-auto mr-4"
          >
            수정
          </button>
          <button
            onClick={async () => {
              try {
                await deleteTestPaperById(testPaperId);
                alert("문제집이 삭제되었습니다.");
                navigate({ to: "/test-papers" });
              } catch (e) {
                alert("문제집 삭제가 실패하였습니다.");
                console.log(e);
              }
            }}
            className="cursor-pointer bg-blue-600 px-6 py-1 text-white text-md rounded-md w-auto"
          >
            삭제
          </button>
        </div>
      </div>
      <div>
        <div className="ml-8">
          <div className="border-solid border-gray-200 rounded-xl border-1 shadow-sm h-[400px] overflow-y-auto">
            {selectedLog === undefined ? (
              <div>
                <SubmissionLogHeader />
                {submissionLogs.map((submissionLog, index) => (
                  <SubmissionLogListItem
                    key={submissionLog.submissionId}
                    submissionLog={submissionLog}
                    index={index}
                    setSelectedLog={setSelectedLog}
                    setDetailedSubmission={setDetailedSubmission}
                    setSubmissionResult={setSubmissionResult}
                  />
                ))}
              </div>
            ) : (
              detailedSubmission && (
                <div className="relative w-[500px] rounded-2xl bg-white p-6">
                  {/* 닫기 버튼 */}
                  <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors duration-200 text-xl cursor-pointer"
                    onClick={() => setSelectedLog(undefined)}
                    aria-label="Close"
                  >
                    ✕
                  </button>

                  {/* 로그 내용 */}
                  <div className="flex flex-col gap-6 mt-6">
                    {/* 점수 랭킹 */}
                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl shadow-inner">
                      <span className="text-lg font-medium text-gray-700">
                        점수 랭킹
                      </span>
                      {detailedSubmission.scoreRank === null ? (
                        <span className="text-xl font-bold text-red-600">
                          등수 없음
                        </span>
                      ) : (
                        <span className="text-xl font-bold text-blue-600">
                          {detailedSubmission.scoreRank}/
                          {detailedSubmission.totalUserCount}
                        </span>
                      )}
                    </div>

                    {/* 걸린 시간 */}
                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl shadow-inner">
                      <span className="text-lg font-medium text-gray-700">
                        평균 소요 시간
                      </span>
                      <span className="text-xl font-semibold text-green-600">
                        {Math.floor(
                          detailedSubmission.averageElapsedTimeSeconds / 60
                        )}
                        분 {detailedSubmission.averageElapsedTimeSeconds % 60}초
                      </span>
                    </div>

                    {/* 평균 시간 랭킹 */}
                    <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl shadow-inner">
                      <span className="text-lg font-medium text-gray-700">
                        시간 랭킹
                      </span>
                      {detailedSubmission.elapsedTimeRank === null ? (
                        <span className="text-xl font-bold text-red-600">
                          등수 없음
                        </span>
                      ) : (
                        <span className="text-xl font-bold text-purple-600">
                          {detailedSubmission.elapsedTimeRank}/
                          {detailedSubmission.totalUserCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
          {/* 결과 표시 */}
          <div className="mt-4">
            <div className="border-solid border-gray-200 rounded-xl border-1 shadow-sm h-[308px] overflow-y-auto">
              <div className="text-center my-2">
                <div className="flex items-center gap-3 ml-4 py-2">
                  <span className="font-extrabold text-lg text-gray-800">
                    제출 결과
                  </span>
                  <span className="text-gray-600">내 점수:</span>
                  {submissionResult && (
                    <span className="font-bold text-blue-600 text-xl">
                      {submissionResult?.totalScore}점
                    </span>
                  )}
                </div>
                <div>
                  <SubmissionResultListHeader />
                  {submissionResult &&
                    submissionResult.itemSubmissionResults.map(
                      (submissionProblme, index) => (
                        <SubmissionResultByProblem
                          index={index}
                          submissionProblem={submissionProblme}
                        />
                      )
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestPaperDetailedPage;
