import { useEffect, useState } from "react";
import { getSingleProblemById, solveSingleProblem } from "../apis/problem";
import type { ProblemItemResponse } from "../types/problem";
import { AiOutlineCopy } from "react-icons/ai";
import { difficultyToKorean } from "../../utils/difficultyTransform";
import { problemTypeToKorea } from "../../utils/problemTypeToKorea";
const baseURL = import.meta.env.VITE_API_BASE_URL;

interface ProblemDetailPageProps {
  problemId: string | number;
}

function ProblemDetailPage({ problemId }: ProblemDetailPageProps) {
  const [problem, setProblem] = useState<ProblemItemResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [answers, setAnswers] = useState<string[]>([""]); // 여러 정답 관리

  useEffect(() => {
    setIsLoading(true);
    getSingleProblemById(String(problemId))
      .then((res) => setProblem(res))
      .finally(() => setIsLoading(false));
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
    <div className="flex justify-center mt-24">
      <div className="p-4 flex flex-col gap-4 relative mb-36">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <span className="font-bold">
              {problem.id}. {problem.singleProblemName}
            </span>
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
              className="w-48"
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

        <div className="flex gap-4 absolute bottom-[-120px] right-0">
          <button
            onClick={() => {
              solveSingleProblem(problem.problemId, answers);
            }}
            className="cursor-pointer bg-blue-600 px-6 py-1 text-white text-md rounded-md w-auto"
          >
            제출
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProblemDetailPage;
