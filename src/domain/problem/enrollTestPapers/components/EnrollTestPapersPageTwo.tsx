import { useNavigate } from "@tanstack/react-router";
import { useTestPapersStore } from "../hooks/useTestPapers";
import type { DifficultyType, ProblemType } from "../../types/problem";
import { AiOutlineCopy } from "react-icons/ai";
import { useEffect } from "react";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const difficultyMap: Record<DifficultyType, string> = {
  LOW: "하",
  MID_LOW: "중하",
  MID: "중",
  MID_HIGH: "중상",
  HIGH: "상",
  KILLER: "칼러",
};

const problemMap: Record<ProblemType, string> = {
  MULTIPLE_CHOICE: "객관식",
  SHORT_ANSWER: "단답형",
};

function EnrollTestPapersPageTwo() {
  const navigate = useNavigate();
  const { problems, selectedIndex, insertTestPapers } = useTestPapersStore();

  useEffect(() => {
    if (problems[selectedIndex].length === 0) {
      navigate({ to: "/enroll-test-papers" });
    }
  }, [problems[selectedIndex]]);

  return (
    <div className="flex justify-center mt-24">
      <div className="relative border-solid border-gray-300 border-[1px] rounded-2xl w-[680px] h-[720px]">
        <div className="py-12 h-[640px] overflow-y-auto">
          {problems[selectedIndex].map((problem) => (
            <section className="relative w-[540px] mb-4 ml-[20px] border-solid border-gray-300 border-[1px] rounded-2xl">
              <div className="bg-[#F6F6F6] p-4 rounded-t-2xl">
                <span className="font-bold text-xl">{problem.id}번 문제</span>
              </div>

              <button
                className="absolute right-2 top-3 bg-blue-600 px-4 py-1 cursor-pointer"
                onClick={() => {
                  insertTestPapers({ ...problem, score: 0 });
                  navigate({ to: "/enroll-test-papers-three" });
                }}
              >
                <span className="text-white text-md">선택</span>
              </button>
              <div className="flex py-4">
                <div className="mr-12 flex flex-col gap-2 ml-4 items-center">
                  <AiOutlineCopy size="24px" className="mb-2" />
                  <span className="text-md text-blue-400 px-2 font-bold rounded-lg bg-gray-100 text-center">
                    {difficultyMap[problem.difficulty]}
                  </span>
                  <span className="text-md text-gray-500 px-2 font-bold rounded-lg bg-gray-100 text-center">
                    {problemMap[problem.type]}
                  </span>
                </div>
                <img
                  className="w-48"
                  src={`${baseURL}/v1/image?imageSource=${problem.problemImage}`}
                  alt="문제 이미지"
                />
              </div>
            </section>
          ))}
        </div>
        <button
          onClick={() => {
            navigate({ to: "/enroll-test-papers" });
          }}
          className="absolute right-4 bottom-4 bg-blue-600 px-6 py-1 cursor-pointer"
        >
          <span className="text-white text-md">이전</span>
        </button>
      </div>
    </div>
  );
}

export default EnrollTestPapersPageTwo;
