import { useEffect, useState } from "react";
import type { TestPaperDetailedResponse } from "../types/testPaper";
import { getTestPapersById } from "../apis/testPaper";
import { AiOutlineCopy } from "react-icons/ai";
import {
  difficultyMap,
  problemMap,
} from "../enrollTestPapers/utils/problemMap";

const baseURL = import.meta.env.VITE_API_BASE_URL;

function TestPaperDetailedPage({ testPaperId }: { testPaperId: string }) {
  const [testPaper, setTestPaper] = useState<TestPaperDetailedResponse | null>(
    null
  );
  // 여러 문제의 여러 정답을 관리 (2차원 배열)
  const [answers, setAnswers] = useState<string[][]>([[""]]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [submissionResult, setSubmissionResult] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchTestPaper = async () => {
      const testPaper = await getTestPapersById(String(testPaperId));
      setTestPaper(testPaper);

      // itemDetails 개수만큼 정답 배열 초기화 (예: [[""], [""], ...])
      const initialAnswers = testPaper.itemDetails.map(() => [""]);
      setAnswers(initialAnswers);
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
    <div className="flex justify-center mt-24">
      <div>
        {/*  */}
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

        {/*  */}
        <div className="flex items-center gap-8">
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
              <span className="focus:outline-none focus:ring-2 focus:ring-blue-400 px-2 rounded-md">
                {testPaper.assessmentName}
              </span>

              {/* 시간 제한 */}
              <div className="flex items-center gap-1">
                <span className="text-sm">시간제한/</span>
                <span className="focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md text-center mx-1">
                  {testPaper.minutes}
                </span>
                <span className="text-sm">분</span>
              </div>
            </div>

            <hr />

            <div className="flex justify-between gap-4 items-center border-b-2 border-black my-4">
              <div className="pb-3 focus:outline-none focus:ring-2 focus:ring-blue-400 px-2 rounded-md pb-2">
                <span className="font-bold mb-8 border-b-3 border-blue-400 pb-3">
                  {selectedIndex + 1}번 문제
                </span>
              </div>

              {/* 시간 제한 */}
              <div className="flex items-center gap-1">
                <span className="text-sm">점수/</span>
                <span className="focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md text-center">
                  {/* {testPaper?.itemDetails[selectedIndex].score} */}
                  30
                </span>
                <span className="text-sm">점</span>
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
                    {problemMap[problem.difficulty]}
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
            <div className="flex gap-2 items-center">
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
              console.log(answers);
            }}
            className="cursor-pointer bg-blue-600 px-6 py-1 text-white text-md rounded-md w-auto"
          >
            제출
          </button>
        </div>
      </div>
      {/* 결과 표시 */}
      <div className="ml-8 mt-12">
        {submissionResult !== undefined && (
          <div className="p-4 border rounded-lg shadow-md bg-gray-50">
            <h3 className="font-bold mb-2">결과</h3>
            <p>
              <span className="font-bold">내 점수:</span> {submissionResult}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TestPaperDetailedPage;
