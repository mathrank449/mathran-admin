import { AiOutlineSearch } from "react-icons/ai";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { DifficultyType } from "../../problem/types/problem";
import { difficultys } from "../../problem/utils/difficultys";
import ContestHeader from "./ContestHeader";
import ContestItem from "./ContestItem";
import type { ContestQueryListType } from "../types/contest";
import { getContestByQuery } from "../apis/contest";
import Pagination from "../../../shared/components/Pagination";

const typeMap: Record<string, ContestQueryListType["queryType"]> = {
  전체: "all",
  최신: "new",
  인기: "popular",
};

function ContestListPage() {
  const [page, setPage] = useState(1);
  const [selectedType, setSelectedType] = useState("전체");
  const [queryList, setQueryList] = useState<ContestQueryListType>({
    queryType: "all",
    contestId: "",
    contestName: "",
    difficulty: "",
  });
  console.log(queryList);
  const { data: contestListPagination, isLoading } = useQuery({
    queryKey: ["v1/problem/contest/", queryList, page] as const,
    queryFn: ({ queryKey }) => getContestByQuery(queryKey[1], queryKey[2]),
  });

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-left pl-12 bg-gray-50 text-3xl py-6 w-full">
        경시대회
      </div>
      <nav className="flex items-center gap-8 mt-12">
        <div className="flex gap-2 flex-wrap mr-24">
          {["전체", "최신", "인기"].map((item) => {
            return (
              <button
                key={item}
                onClick={() => {
                  setQueryList((prev) => ({
                    ...prev,
                    queryType: typeMap[item] || "all",
                  }));
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

        <div className="flex items-center w-72  px-3 py-2 bg-white rounded-xl shadow-md border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-400">
          <AiOutlineSearch className="text-gray-400 mr-2 w-5 h-5" />
          <input
            type="text"
            placeholder="경시대회 제목으로 검색"
            className="w-full outline-none text-gray-700 placeholder-gray-400"
            value={queryList.contestName}
            onChange={(e) => {
              setQueryList((prev) => ({
                ...prev,
                contestName: e.target.value,
              }));
            }}
          />
        </div>
      </nav>
      <div>
        <ContestHeader />
        {!isLoading && contestListPagination?.queryResults ? (
          contestListPagination?.queryResults
            .sort((a, b) => Number(a.contestId) - Number(b.contestId))
            .map((contest, index) => (
              <ContestItem
                key={contest.contestId}
                contest={contest}
                index={index}
              />
            ))
        ) : (
          <div>데이터 없음</div>
        )}
      </div>
      {contestListPagination && (
        <Pagination
          setPage={setPage}
          pageInfo={{
            currentPageNumber: contestListPagination?.currentPageNumber,
            possibleNextPageNumbers:
              contestListPagination?.possibleNextPageNumbers,
          }}
        />
      )}
    </div>
  );
}

export default ContestListPage;
