import { useEffect, useState } from "react";
import GradeItem from "../../components/GradeItem";
import { useQuery } from "@tanstack/react-query";
import { getCourse } from "../../apis/course";
import UnitSelection from "../../components/UnitSelection";
import { districtsMap, regions } from "../../datas/regions";
import { getProblemsByQuery } from "../../apis/problem";
import type { DifficultyType, ProblemType } from "../../types/problem";
import { useProblemStore } from "../stores/problems";
import { useNavigate } from "@tanstack/react-router";
import { getSchoolsByLocation } from "../../apis/school";
import type { School } from "../../types/school";
import type { SelectedUnits } from "../../types/course";

const types = ["단원별 문제", "id로 찾기"];
const difficultyMap: Record<string, DifficultyType> = {
  하: "LOW",
  중하: "MID_LOW",
  중: "MID",
  중상: "MID_HIGH",
  상: "HIGH",
  칼러: "KILLER",
};
const difficultys = ["하", "중하", "중", "중상", "상", "킬러"];

const problemMap: Record<string, ProblemType> = {
  객관식: "MULTIPLE_CHOICE",
  단답형: "SHORT_ANSWER",
};
const problemTypes = ["객관식", "단답형"];

function EnrollProblemPage() {
  const navigate = useNavigate();
  const { setProblems } = useProblemStore();
  const [selectedType, setSelectedType] = useState(0);
  const [selectedGrade, setSelectedGrade] = useState(0);
  const [selectedUnits, setSelectedUnits] = useState<SelectedUnits>({
    large: undefined,
    middle: undefined,
    small: undefined,
  });

  const [selectedDifficultyIndex, setSelectedDifficultyIndex] = useState(0);
  const [selectedProblemTypeIndex, setSelectedProblemTypeIndex] = useState(0);
  const [yearChecked, setYearChecked] = useState(false);
  const [year, setYear] = useState(2025);

  const [schoolChecked, setSchoolChecked] = useState(false);
  const [region, setRegion] = useState("");
  const [district, setDistrict] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [schools, setSchool] = useState<School[]>([]);

  const { data: gradeList } = useQuery({
    queryKey: [`v1/problem/course/`, ""],
    queryFn: ({ queryKey }) => getCourse(queryKey[1]),
  });

  useEffect(() => {
    const fetchData = async () => {
      const schoolData = await getSchoolsByLocation({
        cityName: region,
        district,
      });
      setSchool(schoolData);
    };
    fetchData();
  }, [district]);

  return (
    <div className="flex justify-center mt-24">
      <div className="border-solid border-gray-300 border-[1px] rounded-2xl w-[1480px] relative">
        <div className="w-full flex justify-start items-center pl-12 gap-12 py-4">
          {types.map((item, index) => (
            <button
              key={item}
              type="button"
              onClick={() => setSelectedType(index)}
              className={`cursor-pointer pb-1 ${
                selectedType === index
                  ? "border-b-2 border-blue-500"
                  : "border-b-2 border-transparent"
              }`}
            >
              <h2 className="font-bold text-lg">{item}</h2>
            </button>
          ))}
        </div>
        <div className="flex border-t-[1px] border-gray-300 border-solid">
          <div className="w-[840px] border-r-[1px] border-gray-300 border-solid">
            <div className="py-4 border-b border-gray-300 flex flex-wrap gap-2 justify-center">
              {gradeList?.map((course, index) => (
                <GradeItem
                  key={course.coursePath}
                  text={course.courseName}
                  handleClick={() => {
                    setSelectedGrade(index);
                  }}
                  selected={selectedGrade === index}
                />
              ))}
            </div>
            <div className="py-4 px-12 h-[500px] overflow-y-auto">
              {gradeList ? (
                <div>
                  <UnitSelection
                    grade={gradeList[selectedGrade]}
                    selectedUnits={selectedUnits}
                    setSelectedUnits={setSelectedUnits}
                  />
                </div>
              ) : (
                <div>Loading...</div>
              )}
            </div>
          </div>
          <div className="w-[440px] pl-4 mt-4">
            {/* 난이도 */}
            <div className="py-4">
              <span className="text-md">난이도</span>
              <div className="flex flex-wrap gap-2 justify-start mt-2">
                {difficultys.map((difficulty, index) => (
                  <GradeItem
                    key={difficulty}
                    text={difficulty}
                    handleClick={() => {
                      setSelectedDifficultyIndex(index);
                    }}
                    selected={selectedDifficultyIndex === index}
                  />
                ))}
              </div>
            </div>
            {/* 문제 타입 */}
            <div className="py-4">
              <span className="text-md">난이도</span>
              <div className="flex flex-wrap gap-2 justify-start mt-2">
                {problemTypes.map((problemType, index) => (
                  <GradeItem
                    key={problemType}
                    text={problemType}
                    handleClick={() => {
                      setSelectedProblemTypeIndex(index);
                    }}
                    selected={selectedProblemTypeIndex === index}
                  />
                ))}
              </div>
            </div>
            {/* 연도 */}
            <div className="py-4">
              <div className="mb-2">
                <span className="text-md">연도</span>
                <input
                  type="checkbox"
                  checked={yearChecked}
                  onChange={(e) => setYearChecked(e.target.checked)}
                  className="w-4 h-4 ml-1 align-[-2px]"
                />
              </div>
              {yearChecked && (
                <input
                  type="number"
                  value={year}
                  disabled={!yearChecked}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="border border-gray-300 rounded-xl px-2 py-1 w-24"
                />
              )}
            </div>
            {/* 학교 */}
            <div className="py-4">
              {/* 체크박스 */}
              <div className="flex items-center gap-2">
                <span className="text-md">학교</span>
                <input
                  type="checkbox"
                  checked={schoolChecked}
                  onChange={(e) => setSchoolChecked(e.target.checked)}
                  className="w-4 h-4"
                />
              </div>

              {/* 드롭다운 */}
              {schoolChecked && (
                <div className="flex gap-2 mt-2">
                  {/* 지역 선택 */}
                  <div className="relative">
                    <select
                      value={region}
                      onChange={(e) => {
                        setRegion(e.target.value);
                        setDistrict("");
                        setSelectedSchool("");
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
                        setSelectedSchool("");
                      }}
                      className="border border-gray-300 rounded px-2 py-1 w-38 max-h-40 overflow-y-auto"
                      disabled={!region}
                    >
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
                      value={selectedSchool}
                      onChange={(e) => setSelectedSchool(e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 w-52 max-h-40 overflow-y-auto"
                      disabled={!district}
                    >
                      <option value="">학교 선택</option>
                      {district &&
                        schools.map((school) => (
                          <option
                            key={school.schoolCode}
                            value={school.schoolName}
                          >
                            {school.schoolName}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <button
          className="absolute right-12 bottom-4 bg-blue-600 px-6 py-1 cursor-pointer"
          onClick={async () => {
            let problems;
            if (selectedUnits.small?.coursePath === undefined) {
              alert("단원을 선택해주세요");
              return;
            }
            if (yearChecked && schoolChecked) {
              problems = await getProblemsByQuery({
                difficulty: difficultyMap[difficultys[selectedDifficultyIndex]],
                answerType: problemMap[problemTypes[selectedProblemTypeIndex]],
                coursePath: selectedUnits.small?.coursePath,
                year: String(year),
                location: "",
              });
            } else if (yearChecked) {
              problems = await getProblemsByQuery({
                difficulty: difficultyMap[difficultys[selectedDifficultyIndex]],
                answerType: problemMap[problemTypes[selectedProblemTypeIndex]],
                coursePath: selectedUnits.small?.coursePath,
                year: String(year),
                location: "",
              });
            } else if (schoolChecked) {
              problems = await getProblemsByQuery({
                difficulty: difficultyMap[difficultys[selectedDifficultyIndex]],
                answerType: problemMap[problemTypes[selectedProblemTypeIndex]],
                coursePath: selectedUnits.small?.coursePath,
                year: "",
                location: "",
              });
            } else {
              problems = await getProblemsByQuery({
                difficulty: difficultyMap[difficultys[selectedDifficultyIndex]],
                answerType: problemMap[problemTypes[selectedProblemTypeIndex]],
                coursePath: selectedUnits.small?.coursePath,
                year: "",
                location: "",
              });
            }
            console.log(problems);
            if (problems.length === 0) {
              alert("해당 조건을 만족하는 문제가 없습니다.");
              return;
            }
            setProblems(problems);
            navigate({ to: "/enroll-problem-two" });
          }}
        >
          <span className="text-white text-md">다음</span>
        </button>
      </div>
    </div>
  );
}

export default EnrollProblemPage;
