import type { CourseType } from "../types/problem";
import { useCourseList } from "../hooks/useCourseList";

type SelectedUnits = {
  large?: CourseType;
  middle?: CourseType;
  small?: CourseType;
};

function UnitSelection({
  grade,
  selectedUnits,
  setSelectedUnits,
}: {
  grade: CourseType;
  selectedUnits: SelectedUnits;
  setSelectedUnits: React.Dispatch<React.SetStateAction<SelectedUnits>>;
  selectedUnit: CourseType | undefined;
  setSelectedUnit: React.Dispatch<React.SetStateAction<CourseType | undefined>>;
}) {
  const { list: unitLargeList } = useCourseList(grade.coursePath);
  const { list: unitMiddleList } = useCourseList(
    selectedUnits.large?.coursePath
  );
  const { list: unitSmallList } = useCourseList(
    selectedUnits.middle?.coursePath
  );

  return (
    <ul className="space-y-2">
      {unitLargeList.map((unitLarge) => (
        <li key={unitLarge.coursePath}>
          {/* 대단원 */}
          <div
            className={`p-2 rounded cursor-pointer transition-colors duration-150 ${
              selectedUnits.large?.coursePath === unitLarge.coursePath
                ? "bg-blue-100 text-blue-900 font-semibold"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() =>
              setSelectedUnits({
                large: unitLarge,
                middle: undefined,
                small: undefined,
              })
            }
          >
            ▸ {unitLarge.courseName}
          </div>

          {selectedUnits.large?.coursePath === unitLarge.coursePath && (
            <ul className="ml-6 mt-2 space-y-1 border-l-2 border-blue-200 pl-4">
              {unitMiddleList.map((unitMiddle) => (
                <li key={unitMiddle.coursePath}>
                  {/* 중단원 */}
                  <div
                    className="p-2 bg-white rounded hover:bg-gray-100 cursor-pointer"
                    onClick={() =>
                      setSelectedUnits({
                        large: unitLarge,
                        middle: unitMiddle,
                        small: undefined,
                      })
                    }
                  >
                    └ {unitMiddle.courseName}
                    {selectedUnits.middle?.coursePath ===
                      unitMiddle.coursePath && (
                      <ul className="ml-6 mt-2 space-y-1 border-l-2 border-blue-200 pl-4">
                        {unitSmallList.map((unitSmall) => (
                          <li key={unitSmall.coursePath}>
                            {/* 소단원 */}
                            <div
                              className={`p-2 rounded cursor-pointer transition-colors ${
                                selectedUnits.small?.coursePath ===
                                unitSmall.coursePath
                                  ? "bg-blue-200 text-blue-900 font-semibold"
                                  : "bg-white hover:bg-gray-100"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation(); // 부모 클릭 이벤트 방지
                                setSelectedUnits({
                                  large: unitLarge,
                                  middle: unitMiddle,
                                  small: unitSmall,
                                });
                              }}
                            >
                              └ {unitSmall.courseName}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

export default UnitSelection;
