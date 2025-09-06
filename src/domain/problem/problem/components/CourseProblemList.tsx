import { AiOutlineSearch } from "react-icons/ai";
import { useEffect, useState } from "react";
import type { SelectedUnitsGrade } from "../../types/course";
import { useQuery } from "@tanstack/react-query";
import type { SingleProblemQueryListType } from "../types/problem";
import { getSingleProblemsByQuery } from "../apis/problem";
import type { CourseType, DifficultyType } from "../../types/problem";
import { difficultys } from "../../utils/difficultys";
import ProblemListHeader from "./ProblemListHeader";
import ProblemItem from "./ProblemItem";
import UnitSelectionByGrade from "../../components/UnitSelectionByGrade";
import Pagination from "../../../../shared/components/Pagination";

const typeMap: Record<string, SingleProblemQueryListType["queryType"]> = {
  전체: "all",
  최신: "new",
  인기: "popular",
  "우리학교 예상": "school",
};

function CourseProblemList() {
  const [page, setPage] = useState(1);
  const [selectedType, setSelectedType] = useState("전체");
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

  const { data: problemListPagination, isLoading } = useQuery({
    queryKey: ["v1/problem/single/", queryList, page] as const,
    queryFn: ({ queryKey }) =>
      getSingleProblemsByQuery(queryKey[1], queryKey[2]),
  });

  useEffect(() => {
    setQueryList((prev) => ({
      ...prev,
      queryType: typeMap[selectedType] || "all",
    }));
  }, [selectedType]);

  const [selectedUnits, setSelectedUnits] = useState<SelectedUnitsGrade>({
    grade: undefined,
    large: undefined,
    middle: undefined,
    small: undefined,
  });

  const [selectedUnit, setSelectedUnit] = useState<CourseType | undefined>(
    undefined
  );
  const [isUnitSelected, setIsUnitSelected] = useState(false);

  useEffect(() => {
    if (isUnitSelected === true)
      setQueryList({
        queryType: "all",
        singleProblemId: "",
        courseInfo: selectedUnit,
        singleProblemName: "",
        answerType: undefined,
        difficulty: "",
      });
  }, [isUnitSelected]);

  if (isUnitSelected)
    return (
      <div className="flex flex-col items-center gap-8">
        <div className="text-left pl-12 bg-gray-50 text-3xl py-6 w-full flex justify-between">
          <span>
            {selectedUnits.grade?.courseName.replace(/^\d+\s*/, "")}
            {selectedUnits.large && (
              <>/{selectedUnits.large.courseName.replace(/^\d+\s*/, "")}</>
            )}
            {selectedUnits.middle && (
              <>/{selectedUnits.middle.courseName.replace(/^\d+\s*/, "")}</>
            )}
            {selectedUnits.small && (
              <>/{selectedUnits.small.courseName.replace(/^\d+\s*/, "")}</>
            )}
            {selectedUnit && (
              <>/{selectedUnit.courseName.replace(/^\d+\s*/, "")}</>
            )}
          </span>
          <button
            onClick={() => {
              setIsUnitSelected(false);
            }}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <span className="pr-2">←</span>
            <span className="font-medium text-gray-700">단원 선택</span>
          </button>
        </div>
        <nav className="flex items-center gap-8 mt-12">
          <div className="flex gap-2 flex-wrap mr-24">
            {["전체", "최신", "인기"].map((item) => (
              <button
                key={item}
                onClick={() => setSelectedType(item)}
                className={`px-4 py-2 rounded-full border transition-colors duration-200 cursor-pointer
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
            problemListPagination.queryResults.map((problem, index) => (
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
  return (
    <div>
      <div className="text-left pl-12 bg-gray-50 text-3xl py-6 w-full">
        단원 선택
      </div>
      <div className="flex justify-center border-t-[1px] border-gray-300 border-solid">
        <div className="w-[840px] flex flex-col items-right">
          <div className="py-4 px-12 h-[500px] overflow-y-auto mt-24 border-r-[1px] border-gray-300 border-solid">
            <UnitSelectionByGrade
              selectedUnits={selectedUnits}
              setSelectedUnits={setSelectedUnits}
              selectedUnit={selectedUnit}
              setSelectedUnit={setSelectedUnit}
            />
          </div>
          <button
            className={`mt-4 mx-auto px-4 py-2 rounded text-white font-semibold transition ${
              selectedUnit
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!selectedUnit}
            onClick={() => {
              setIsUnitSelected(true);
              console.log("선택된 단원:", selectedUnit);
            }}
          >
            선택 완료
          </button>
        </div>
      </div>
    </div>
  );
}

export default CourseProblemList;
