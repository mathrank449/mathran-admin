import { useEffect, useState } from "react";
import { getSingleProblemById } from "../apis/problem";
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

  useEffect(() => {
    setIsLoading(true);
    getSingleProblemById(String(problemId))
      .then((res) => setProblem(res))
      .finally(() => setIsLoading(false));
  }, [problemId]);

  if (isLoading) return <div>로딩중...</div>;
  if (!problem) return <div>문제를 불러올 수 없습니다.</div>;
  console.log(problem);
  return (
    <div className="flex justify-center mt-24">
      <div className="p-4 flex flex-col gap-4 relative mb-36">
        <div className="mb-4">
          <span>{problem.singleProblemName}</span>

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

        <div className="flex gap-4 absolute bottom-[-120px] right-0">
          <button className="cursor-pointer bg-blue-600 px-6 py-1 text-white text-md rounded-md w-auto">
            등록 완료
          </button>
          <button className="cursor-pointer   bg-blue-600 px-6 py-1 text-white text-md rounded-md w-auto">
            이전
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProblemDetailPage;
