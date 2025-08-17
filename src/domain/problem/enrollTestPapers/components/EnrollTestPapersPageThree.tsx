import { useEffect, useState } from "react";
import { useTestPapersStore } from "../hooks/useTestPapers";
import { AiOutlineCopy } from "react-icons/ai";
import type { DifficultyType, ProblemType } from "../../types/problem";
import { useNavigate } from "@tanstack/react-router";
import { enrollTestPapers } from "../apis/testPapers";
import TestPapersNav from "./TestPapersNav";

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

function EnrollTestPapersPageThree() {
  const {
    testPapers,
    selectedIndex,
    setSelectedIndex,
    setTestPapersScore,
    time,
    setTime,
    title,
    setTitle,
  } = useTestPapersStore();
  const navigate = useNavigate();
  const problem = testPapers[selectedIndex];

  useEffect(() => {
    if (problem === undefined) {
      navigate({ to: "/enroll-test-papers-two" });
    }
  }, [problem]);

  if (problem === undefined) return <div>문제 없음</div>;

  return (
    <div>
      <TestPapersNav />
      <div className="p-4 flex flex-col gap-4 relative mb-36">
        {/* 제목 입력창 */}
        <div className="flex gap-4 items-center">
          {/* 문서 제목 */}
          <input
            type="text"
            placeholder="문제집 제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-[3] focus:outline-none focus:ring-2 focus:ring-blue-400 px-2 rounded-md"
          />

          {/* 시간 제한 */}
          <div className="flex items-center gap-1 flex-[1]">
            <span className="text-sm">시간제한/</span>
            <input
              type="number"
              value={time}
              onChange={(e) => setTime(Number(e.target.value))}
              className="w-12 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md text-center"
            />
            <span className="text-sm">분</span>
          </div>
        </div>

        <hr />

        <div className="flex gap-4 items-center border-b-2 border-black">
          <div className="pb-3 flex-[3] focus:outline-none focus:ring-2 focus:ring-blue-400 px-2 rounded-md">
            <span className="font-bold mb-8 border-b-3 border-blue-400 pb-3">
              {selectedIndex + 1}번 문제
            </span>
          </div>

          {/* 시간 제한 */}
          <div className="flex items-center gap-1 flex-[1]">
            <span className="text-sm">점수/</span>
            <input
              type="number"
              value={problem.score}
              onChange={(e) => {
                setTestPapersScore(Number(e.target.value));
              }}
              className="w-12 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md text-center"
            />
            <span className="text-sm">점</span>
          </div>
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
                alert("문제집 제목이 없습니다.");
                return;
              }
              try {
                // testPapers 안에 undefined 있는지 먼저 체크
                const undefinedIndex = testPapers.findIndex(
                  (p) => p === undefined
                );

                if (undefinedIndex !== -1) {
                  alert(`${undefinedIndex + 1}번 문제 데이터가 비어있습니다.`);
                  setSelectedIndex(undefinedIndex);
                  return;
                }

                const problems = testPapers.map((problem) => ({
                  id: problem!.id,
                  score: problem!.score,
                }));

                // 총점 계산
                const totalScore = problems.reduce(
                  (acc, cur) => acc + cur.score,
                  0
                );

                if (totalScore !== 100) {
                  alert(`총점은 100점이어야 합니다. (현재: ${totalScore}점)`);
                  return;
                }

                await enrollTestPapers({
                  title,
                  problems,
                  time,
                });
                alert("문제집 등록 완료");
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
              navigate({ to: "/enroll-test-papers-two" });
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

export default EnrollTestPapersPageThree;
