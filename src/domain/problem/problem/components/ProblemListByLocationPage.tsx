import { AiOutlineSearch } from "react-icons/ai";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import ProblemListHeader from "./ProblemListHeader";
import type { SingleProblemQueryListType } from "../types/problem";
import ProblemItem from "./ProblemItem";
import { getSingleProblemsByQuery } from "../apis/problem";
import type { DifficultyType } from "../../types/problem";
import { difficultys } from "../../utils/difficultys";
import { getSchoolsByLocation } from "../../apis/school";
import type { School } from "../../types/school";
import { districtsMap, regions } from "../../datas/regions";
import Pagination from "../../../../shared/components/Pagination";

const cityMap: Record<string, string> = {
  seoul: "서울특별시",
  busan: "부산광역시",
  daegu: "대구광역시",
  incheon: "인천광역시",
  gwangju: "광주광역시",
  daejeon: "대전광역시",
  ulsan: "울산광역시",
};

function ProblemListByLocationPage({
  defaultLocation,
}: {
  defaultLocation: string;
}) {
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
    pastProblem: "",
  });

  const [region, setRegion] = useState<string | undefined>(
    cityMap[defaultLocation]
  );
  const [district, setDistrict] = useState<string | undefined>("");
  const [schools, setSchool] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchData = async () => {
      if (region && district) {
        const schoolData = await getSchoolsByLocation({
          cityName: region,
          district,
        });
        setSchool(schoolData);
      }
    };
    fetchData();
  }, [district]);

  const { data: problemListPagination, isLoading } = useQuery({
    queryKey: [
      "v1/problem/single/",
      queryList,
      page,
      selectedSchool,
      region,
      district,
    ] as const,
    queryFn: ({ queryKey }) =>
      getSingleProblemsByQuery(
        queryKey[1],
        queryKey[2],
        queryKey[3],
        queryKey[4],
        queryKey[5]
      ),
  });

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-left pl-12 bg-gray-50 text-3xl py-6 w-full">
        지역 별 문제
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
        <div>
          {/* 학교 */}
          <div className="py-4">
            {/* 드롭다운 */}
            {
              <div className="flex gap-2 mt-2">
                {/* 지역 선택 */}
                <div className="relative">
                  <select
                    value={region}
                    onChange={(e) => {
                      setRegion(e.target.value);
                      setDistrict(districtsMap[e.target.value][0]);
                      setSelectedSchool(undefined);
                    }}
                    className="border border-gray-300 rounded px-2 py-1 w-32 max-h-40 overflow-y-auto"
                  >
                    <option value="">전체지역</option>
                    {regions.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 구 선택 */}
                <div className="relative">
                  <select
                    value={district}
                    onChange={(e) => {
                      setDistrict(e.target.value);
                      setSelectedSchool(undefined);
                    }}
                    className="border border-gray-300 rounded px-2 py-1 w-38 max-h-40 overflow-y-auto"
                    disabled={!region}
                  >
                    <option value="">전체지역</option>
                    {region &&
                      districtsMap[region].map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                  </select>
                </div>

                {/* 학교 선택 */}
                <div className="relative flex-1 pr-2">
                  <select
                    value={selectedSchool?.schoolCode ?? ""}
                    onChange={(e) => {
                      const school = schools.find(
                        (s) => s.schoolCode === e.target.value
                      );
                      setSelectedSchool(school);
                    }}
                    className="border border-gray-300 rounded px-2 py-1 w-52 max-h-40 overflow-y-auto"
                    disabled={!district}
                  >
                    <option value="">학교 선택</option>
                    {region &&
                      district &&
                      schools.map((school) => (
                        <option
                          key={school.schoolCode}
                          value={school.schoolCode}
                        >
                          {school.schoolName}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            }
          </div>
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
        {!isLoading && problemListPagination ? (
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

export default ProblemListByLocationPage;
