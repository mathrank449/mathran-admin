import { AiOutlineSearch } from "react-icons/ai";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ProblemListHeader from "./ProblemListHeader";
import type {
  PastProblemType,
  SingleProblemQueryListType,
} from "../types/problem";
import ProblemItem from "./ProblemItem";
import { getSingleProblemsByQuery } from "../apis/problem";
import type { DifficultyType } from "../../types/problem";
import { difficultys } from "../../utils/difficultys";
import Pagination from "../../../../shared/components/Pagination";

function ProblemListByPastProblemPage({
  defaultPastProblem,
}: {
  defaultPastProblem: PastProblemType;
}) {
  const [page, setPage] = useState(1);
  const [selectedType, setSelectedType] = useState("전체");
  const [queryList, setQueryList] = useState<SingleProblemQueryListType>({
    queryType: "pastProblem",
    singleProblemId: "",
    courseInfo: {
      courseName: "전체(과정)",
      coursePath: "",
    },
    singleProblemName: "",
    answerType: undefined,
    difficulty: "",
    pastProblem: defaultPastProblem,
  });

  const { data: problemListPagination, isLoading } = useQuery({
    queryKey: ["v1/problem/single/", queryList, page] as const,
    queryFn: ({ queryKey }) =>
      getSingleProblemsByQuery(queryKey[1], queryKey[2]),
  });

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-left pl-12 bg-gray-50 text-3xl py-6 w-full">
        기출 문제
      </div>
      <nav className="flex items-center gap-8 mt-12">
        <div className="flex gap-2 flex-wrap mr-24">
          {[
            { value: "전체", type: "all" },
            { value: "최신", type: "new" },
            { value: "인기", type: "popular" },
          ].map((item) => {
            return (
              <button
                key={item.type}
                onClick={() => {
                  setSelectedType(item.value);
                  setQueryList(
                    (prev) =>
                      ({
                        ...prev,
                        queryType: item.type,
                      } as SingleProblemQueryListType)
                  );
                }}
                className={`px-4 py-2 rounded-full border transition-colors duration-200 cursor-pointer
                ${
                  selectedType === item.value
                    ? "border-indigo-500 bg-indigo-500 text-white shadow-sm"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="text-sm font-medium">{item.value}</span>
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
        {!isLoading && problemListPagination?.queryResults ? (
          problemListPagination.queryResults
            .sort((a, b) => Number(a.id) - Number(b.id))
            .map((problem, index) => (
              <ProblemItem key={problem.id} problem={problem} index={index} />
            ))
        ) : (
          <div>데이터 없음</div>
        )}
      </div>
      {problemListPagination && (
        <Pagination
          setPage={setPage}
          pageInfo={{
            currentPageNumber: problemListPagination?.currentPageNumber,
            possibleNextPageNumbers:
              problemListPagination?.possibleNextPageNumbers,
          }}
        />
      )}
    </div>
  );
}

export default ProblemListByPastProblemPage;
