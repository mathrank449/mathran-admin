import { AiOutlineSearch } from "react-icons/ai";
import { useQuery } from "@tanstack/react-query";
import { getCourse } from "../../apis/course";
import { useEffect, useState } from "react";
import ProblemListHeader from "./ProblemListHeader";
import type { SingleProblemQueryListType } from "../types/problem";
import ProblemItem from "./ProblemItem";
import { getSingleProblemsByQuery } from "../apis/problem";
import type { DifficultyType } from "../../types/problem";
import { difficultys } from "../../utils/difficultys";
import { pathMap } from "../utils/pathMap";
import { useNavigate } from "@tanstack/react-router";

const typeMap: Record<string, SingleProblemQueryListType["queryType"]> = {
  전체: "all",
  최신: "new",
  인기: "popular",
  "단원 별": "course",
  "우리학교 예상": "school",
};

function ProblemListPage() {
  const navigate = useNavigate();
  const { data: gradeList } = useQuery({
    queryKey: [`v1/problem/course/`, ""],
    queryFn: ({ queryKey }) => getCourse(queryKey[1]),
  });
  const [selectedType, setSelectedType] = useState("인기");
  const [queryList, setQueryList] = useState<SingleProblemQueryListType>({
    queryType: "all",
    singleProblemId: "",
    courseInfo: {
      courseName: "전체(과정)",
      coursePath: "",
    },
    singleProblemName: "",
    answerType: undefined,
    difficulty: "",
  });

  const { data: problemList, isLoading } = useQuery({
    queryKey: ["v1/problem/single/", queryList] as const,
    queryFn: ({ queryKey }) => getSingleProblemsByQuery(queryKey[1]),
  });
  console.log(queryList);

  useEffect(() => {
    setQueryList((prev) => ({
      ...prev,
      queryType: typeMap[selectedType] || "all",
    }));
  }, [selectedType]);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-left pl-12 bg-gray-50 text-3xl py-6 w-full">
        인기 문제
      </div>
      <nav className="flex items-center gap-8 mt-12">
        <div className="flex gap-2 flex-wrap mr-24">
          {["전체", "최신", "인기", "단원 별", "우리학교 예상"].map((item) => {
            return (
              <button
                key={item}
                onClick={() => {
                  navigate({ to: pathMap[item] });
                  setSelectedType(item);
                }}
                className={`px-4 py-2 rounded-full border transition-colors duration-200 cursor-pointer
            ${
              selectedType === item
                ? "border-indigo-500 bg-indigo-500 text-white shadow-sm"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
            }`}
              >
                <span className="text-sm font-medium">{item}</span>
              </button>
            );
          })}
        </div>

        <div>
          <select
            value={queryList.difficulty}
            onChange={(e) => {
              setQueryList((prev) => ({
                ...prev,
                difficulty: e.target.value as DifficultyType,
              }));
            }}
            className="border border-gray-300 rounded px-2 py-1 w-42 max-h-40 overflow-y-auto"
          >
            {[
              {
                path: "",
                name: "전체(난이도)",
              },
              ...difficultys,
            ].map((d) => (
              <option key={d.path} value={d.path}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          {gradeList && (
            <select
              value={queryList.courseInfo?.coursePath}
              onChange={(e) => {
                const selected = gradeList.find(
                  (g) => g.coursePath === e.target.value
                ) || {
                  courseName: "전체(과정)",
                  coursePath: "",
                };
                setQueryList((prev) => ({
                  ...prev,
                  courseInfo: selected,
                }));
              }}
              className="border border-gray-300 rounded px-2 py-1 w-42 max-h-40 overflow-y-auto"
            >
              {[
                {
                  courseName: "전체(과정)",
                  coursePath: "",
                },
                ...gradeList,
              ].map((g) => (
                <option key={g.coursePath} value={g.coursePath}>
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
            value={queryList.singleProblemName}
            onChange={(e) => {
              setQueryList((prev) => ({
                ...prev,
                singleProblemName: e.target.value,
              }));
            }}
          />
        </div>
      </nav>
      <div>
        <ProblemListHeader />
        {!isLoading && problemList ? (
          problemList.map((problem, index) => (
            <ProblemItem key={problem.id} problem={problem} index={index} />
          ))
        ) : (
          <div>데이터 없음</div>
        )}
      </div>
    </div>
  );
}

export default ProblemListPage;
