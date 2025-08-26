import { useState } from "react";
import { useProblemStore } from "../stores/problems";
import { AiOutlineCopy } from "react-icons/ai";
import type { DifficultyType, ProblemType } from "../../types/problem";
import { useNavigate } from "@tanstack/react-router";
import { enrollProblemSingle } from "../apis/problem";

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

function EnrollProblemPageThree() {
  const problem = useProblemStore((state) => state.selectedProblem);
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  if (problem === undefined) return <div>문제 없음</div>;

  return (
    <div className="flex justify-center mt-24">
      <div className="p-4 flex flex-col gap-4 relative mb-36">
        {/* 제목 입력창 */}

        <div className="mb-4">
          <input
            type="text"
            placeholder="문제 제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
          />
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

        <div className="flex gap-4 absolute bottom-[-120px] right-0">
          <button
            onClick={async () => {
              if (title == "") {
                alert("문제 제목이 없습니다.");
                return;
              }
              if (!problem.id) {
                alert("문제가 없습니다.");
                return;
              }
              try {
                await enrollProblemSingle(title, problem.id);
                alert("문제 등록 완료");
                navigate({ to: "/" });
              } catch (e) {
                console.log(e);
              }
            }}
            className="cursor-pointer bg-blue-600 px-6 py-1 text-white text-md rounded-md w-auto"
          >
            등록 완료
          </button>
          <button
            onClick={() => {
              navigate({ to: "/enroll-problem-two" });
            }}
            className="cursor-pointer   bg-blue-600 px-6 py-1 text-white text-md rounded-md w-auto"
          >
            이전
          </button>
        </div>
      </div>
    </div>
  );
}

export default EnrollProblemPageThree;
