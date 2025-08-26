import { useCourseList } from "../hooks/useCourseList";
import { useQuery } from "@tanstack/react-query";
import { getCourse } from "../apis/course";
import type { SelectedUnitsGrade } from "../types/course";
import type { CourseType } from "../types/problem";

function UnitSelectionByGrade({
  selectedUnits,
  setSelectedUnits,
  selectedUnit,
  setSelectedUnit,
}: {
  selectedUnits: SelectedUnitsGrade;
  setSelectedUnits: React.Dispatch<React.SetStateAction<SelectedUnitsGrade>>;
  selectedUnit: CourseType | undefined;
  setSelectedUnit: React.Dispatch<React.SetStateAction<CourseType | undefined>>;
}) {
  // 학년 리스트
  const { data: gradeList, isLoading: gradeLoading } = useQuery({
    queryKey: [`v1/problem/course/`, ""],
    queryFn: ({ queryKey }) => getCourse(queryKey[1]),
  });

  const { list: unitLargeList } = useCourseList(
    selectedUnits.grade?.coursePath
  );
  const { list: unitMiddleList } = useCourseList(
    selectedUnits.large?.coursePath
  );
  const { list: unitSmallList } = useCourseList(
    selectedUnits.middle?.coursePath
  );

  if (gradeLoading) return <div>Loading grades...</div>;

  // 체크박스 렌더 함수
  const renderCheckbox = (unit: CourseType) => (
    <input
      type="checkbox"
      className="mr-2"
      checked={selectedUnit?.coursePath === unit.coursePath}
      onChange={(e) => {
        if (e.target.checked) {
          setSelectedUnit(unit);
        } else {
          setSelectedUnit(undefined);
        }
      }}
    />
  );

  return (
    <ul className="space-y-2">
      {/* Grade 세로 리스트 */}
      {gradeList?.map((grade: CourseType) => (
        <li key={grade.coursePath}>
          <div className="flex items-center">
            {renderCheckbox(grade)}
            <div
              className={`flex-1 p-2 rounded cursor-pointer transition-colors duration-150 ${
                selectedUnits.grade?.coursePath === grade.coursePath
                  ? "bg-blue-100 text-blue-900 font-semibold"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() =>
                setSelectedUnits({
                  grade: grade,
                  large: undefined,
                  middle: undefined,
                  small: undefined,
                })
              }
            >
              {grade.courseName}
            </div>
          </div>

          {/* 선택된 Grade의 대단원 트리 */}
          {selectedUnits.grade?.coursePath === grade.coursePath && (
            <ul className="ml-6 mt-2 space-y-1 border-l-2 border-blue-200 pl-4">
              {unitLargeList.map((unitLarge) => (
                <li key={unitLarge.coursePath}>
                  <div className="flex items-center">
                    {renderCheckbox(unitLarge)}
                    <div
                      className={`flex-1 p-2 rounded cursor-pointer transition-colors duration-150 ${
                        selectedUnits.large?.coursePath === unitLarge.coursePath
                          ? "bg-blue-100 text-blue-900 font-semibold"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                      onClick={() =>
                        setSelectedUnits({
                          ...selectedUnits,
                          large: unitLarge,
                          middle: undefined,
                          small: undefined,
                        })
                      }
                    >
                      ▸ {unitLarge.courseName}
                    </div>
                  </div>

                  {/* 선택된 대단원의 중단원 트리 */}
                  {selectedUnits.large?.coursePath === unitLarge.coursePath && (
                    <ul className="ml-6 mt-2 space-y-1 border-l-2 border-blue-200 pl-4">
                      {unitMiddleList.map((unitMiddle) => (
                        <li key={unitMiddle.coursePath}>
                          <div className="flex items-center">
                            {renderCheckbox(unitMiddle)}
                            <div
                              className="flex-1 p-2 bg-white rounded hover:bg-gray-100 cursor-pointer"
                              onClick={() =>
                                setSelectedUnits({
                                  ...selectedUnits,
                                  middle: unitMiddle,
                                  small: undefined,
                                })
                              }
                            >
                              └ {unitMiddle.courseName}
                            </div>
                          </div>

                          {/* 선택된 중단원의 소단원 트리 */}
                          {selectedUnits.middle?.coursePath ===
                            unitMiddle.coursePath && (
                            <ul className="ml-6 mt-2 space-y-1 border-l-2 border-blue-200 pl-4">
                              {unitSmallList.map((unitSmall) => (
                                <li key={unitSmall.coursePath}>
                                  <div className="flex items-center">
                                    {renderCheckbox(unitSmall)}
                                    <div
                                      className={`flex-1 p-2 rounded cursor-pointer transition-colors ${
                                        selectedUnits.small?.coursePath ===
                                        unitSmall.coursePath
                                          ? "bg-blue-200 text-blue-900 font-semibold"
                                          : "bg-white hover:bg-gray-100"
                                      }`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedUnits({
                                          ...selectedUnits,
                                          small: unitSmall,
                                        });
                                      }}
                                    >
                                      └ {unitSmall.courseName}
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

export default UnitSelectionByGrade;
