import { AiOutlineSearch } from "react-icons/ai";
import { useQuery } from "@tanstack/react-query";
import { getCourse } from "../../apis/course";
import { useState } from "react";
import ProblemListHeader from "./ProblemListHeader";
import type { ProblemItemResponse } from "../types/problem";
import ProblemItem from "./ProblemItem";

export const exampleProblems: ProblemItemResponse[] = [
  {
    id: "1",
    title: "물에 빠진 생쥐 구하기",
    problemId: "101",
    problemImage: "/images/problem1.png",
    coursePath: "수학/함수/1차함수",
    answerType: "MULTIPLE_CHOICE",
    difficulty: "HIGH",
    firstTrySuccessCount: 80,
    totalAttemptedCount: 120,
    attemptedUserDistinctCount: 100,
    accuracy: 66.7,
  },
  {
    id: "2",
    title: "물에 빠진 생쥐 구하기2",
    problemId: "102",
    problemImage: "/images/problem2.png",
    coursePath: "수학/확률과통계/순열과조합",
    answerType: "SHORT_ANSWER",
    difficulty: "LOW",
    firstTrySuccessCount: 40,
    totalAttemptedCount: 95,
    attemptedUserDistinctCount: 90,
    accuracy: 42.1,
  },
  {
    id: "3",
    title: "물에 빠진 생쥐 구하기",
    problemId: "101",
    problemImage: "/images/problem1.png",
    coursePath: "수학/함수/1차함수",
    answerType: "MULTIPLE_CHOICE",
    difficulty: "HIGH",
    firstTrySuccessCount: 80,
    totalAttemptedCount: 120,
    attemptedUserDistinctCount: 100,
    accuracy: 66.7,
  },
  {
    id: "4",
    title: "물에 빠진 생쥐 구하기2",
    problemId: "102",
    problemImage: "/images/problem2.png",
    coursePath: "수학/확률과통계/순열과조합",
    answerType: "SHORT_ANSWER",
    difficulty: "LOW",
    firstTrySuccessCount: 40,
    totalAttemptedCount: 95,
    attemptedUserDistinctCount: 90,
    accuracy: 42.1,
  },
  {
    id: "5",
    title: "물에 빠진 생쥐 구하기",
    problemId: "101",
    problemImage: "/images/problem1.png",
    coursePath: "수학/함수/1차함수",
    answerType: "MULTIPLE_CHOICE",
    difficulty: "HIGH",
    firstTrySuccessCount: 80,
    totalAttemptedCount: 120,
    attemptedUserDistinctCount: 100,
    accuracy: 66.7,
  },
  {
    id: "6",
    title: "물에 빠진 생쥐 구하기2",
    problemId: "102",
    problemImage: "/images/problem2.png",
    coursePath: "수학/확률과통계/순열과조합",
    answerType: "SHORT_ANSWER",
    difficulty: "LOW",
    firstTrySuccessCount: 40,
    totalAttemptedCount: 95,
    attemptedUserDistinctCount: 90,
    accuracy: 42.1,
  },
  {
    id: "7",
    title: "물에 빠진 생쥐 구하기",
    problemId: "101",
    problemImage: "/images/problem1.png",
    coursePath: "수학/함수/1차함수",
    answerType: "MULTIPLE_CHOICE",
    difficulty: "HIGH",
    firstTrySuccessCount: 80,
    totalAttemptedCount: 120,
    attemptedUserDistinctCount: 100,
    accuracy: 66.7,
  },
  {
    id: "8",
    title: "물에 빠진 생쥐 구하기2",
    problemId: "102",
    problemImage: "/images/problem2.png",
    coursePath: "수학/확률과통계/순열과조합",
    answerType: "SHORT_ANSWER",
    difficulty: "LOW",
    firstTrySuccessCount: 40,
    totalAttemptedCount: 95,
    attemptedUserDistinctCount: 90,
    accuracy: 42.1,
  },
  {
    id: "9",
    title: "물에 빠진 생쥐 구하기",
    problemId: "101",
    problemImage: "/images/problem1.png",
    coursePath: "수학/함수/1차함수",
    answerType: "MULTIPLE_CHOICE",
    difficulty: "HIGH",
    firstTrySuccessCount: 80,
    totalAttemptedCount: 120,
    attemptedUserDistinctCount: 100,
    accuracy: 66.7,
  },
  {
    id: "10",
    title: "물에 빠진 생쥐 구하기2",
    problemId: "102",
    problemImage: "/images/problem2.png",
    coursePath: "수학/확률과통계/순열과조합",
    answerType: "SHORT_ANSWER",
    difficulty: "LOW",
    firstTrySuccessCount: 40,
    totalAttemptedCount: 95,
    attemptedUserDistinctCount: 90,
    accuracy: 42.1,
  },
];

function ProblemListPage() {
  const { data: gradeList } = useQuery({
    queryKey: [`v1/problem/course/`, ""],
    queryFn: ({ queryKey }) => getCourse(queryKey[1]),
  });
  const [selectedType, setSelectedType] = useState("전체");
  const [grade, setGrade] = useState("");
  const [searchedTitle, setSearchedTitle] = useState("");
  return (
    <div className="flex flex-col items-center gap-8">
      <nav className="flex items-center gap-8">
        <div className="flex gap-2 flex-wrap mr-24">
          {[
            "전체",
            "최신",
            "인기",
            "단원 별",
            "난이도 별",
            "우리학교 예상",
          ].map((item) => (
            <button
              key={item}
              onClick={() => setSelectedType(item)}
              className={`px-4 py-2 rounded-full border transition-colors duration-200
        ${
          selectedType === item
            ? "border-indigo-500 bg-indigo-500 text-white shadow-sm"
            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
        }
      `}
            >
              <span className="text-sm font-medium">{item}</span>
            </button>
          ))}
        </div>

        <div>
          {gradeList && (
            <select
              value={grade}
              onChange={(e) => {
                setGrade(e.target.value);
              }}
              className="border border-gray-300 rounded px-2 py-1 w-32 max-h-40 overflow-y-auto"
            >
              <option value="">전체지역</option>
              {gradeList.map((g) => (
                <option key={g.coursePath} value={g.courseName}>
                  {g.courseName}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="flex items-center w-72  px-3 py-2 bg-white rounded-xl shadow-md border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-400">
          <AiOutlineSearch className="text-gray-400 mr-2 w-5 h-5" />
          <input
            type="text"
            placeholder="문제 제목으로 검색"
            className="w-full outline-none text-gray-700 placeholder-gray-400"
            value={searchedTitle}
            onChange={(e) => {
              setSearchedTitle(e.target.value);
            }}
          />
        </div>
      </nav>
      <div>
        <ProblemListHeader />
        {exampleProblems.map((problem, index) => (
          <ProblemItem key={problem.id} problem={problem} index={index} />
        ))}
      </div>
    </div>
  );
}

export default ProblemListPage;
