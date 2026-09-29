import { useState, type Dispatch, type SetStateAction } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCourse } from "../apis/course";
import type { CourseType } from "../types/problem";
import type { SelectedUnits, SelectedUnitsGrade } from "../types/course";
import {
  isCourseSelected,
  toggleCourseSelection,
  type CourseSelectionRules,
} from "../../testPaper/enrollTestPapers/services/courseSelection";

interface MultipleSelectionProps {
  selectionRules: CourseSelectionRules;
  onSelectionRulesChange: (rules: CourseSelectionRules) => void;
}

interface LegacySingleSelectionProps {
  selectedUnits: SelectedUnits | SelectedUnitsGrade;
  setSelectedUnits:
    | Dispatch<SetStateAction<SelectedUnits>>
    | Dispatch<SetStateAction<SelectedUnitsGrade>>;
  selectedUnit: CourseType | undefined;
  setSelectedUnit: Dispatch<SetStateAction<CourseType | undefined>>;
}

type UnitSelectionByGradeProps =
  | MultipleSelectionProps
  | LegacySingleSelectionProps;

function CourseTreeNode({
  unit,
  depth,
  selectionRules,
  onSelectionRulesChange,
}: {
  unit: CourseType;
  depth: number;
  selectionRules: CourseSelectionRules;
  onSelectionRulesChange: (
    rules: CourseSelectionRules,
    toggledUnit: CourseType
  ) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const { data: children = [], isFetching } = useQuery({
    queryKey: ["v1/problem/course", unit.coursePath],
    queryFn: () => getCourse(unit.coursePath),
    enabled: expanded && depth < 4,
  });
  const checked = isCourseSelected(selectionRules, unit.coursePath);

  return (
    <li>
      <div className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-gray-100">
        <input
          type="checkbox"
          checked={checked}
          onChange={() =>
            onSelectionRulesChange(
              toggleCourseSelection(selectionRules, unit.coursePath),
              unit
            )
          }
          aria-label={`${unit.courseName} 선택`}
          className="h-4 w-4 accent-gray-900"
        />
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="flex flex-1 items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-gray-800 hover:bg-white"
          aria-expanded={expanded}
        >
          <span className="w-4 text-gray-500">{expanded ? "▾" : "▸"}</span>
          <span className={checked ? "font-bold" : "font-medium"}>
            {unit.courseName}
          </span>
        </button>
      </div>
      {expanded && (
        <div className="ml-6 border-l border-gray-300 pl-3">
          {isFetching && (
            <p className="px-3 py-2 text-xs text-gray-500">하위 단원 불러오는 중...</p>
          )}
          {!isFetching && children.length === 0 && (
            <p className="px-3 py-2 text-xs text-gray-400">하위 단원 없음</p>
          )}
          <ul className="space-y-1">
            {children.map((child) => (
              <CourseTreeNode
                key={child.coursePath}
                unit={child}
                depth={depth + 1}
                selectionRules={selectionRules}
                onSelectionRulesChange={onSelectionRulesChange}
              />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

function UnitSelectionByGrade(props: UnitSelectionByGradeProps) {
  const { data: gradeList = [], isLoading } = useQuery({
    queryKey: ["v1/problem/course", ""],
    queryFn: () => getCourse(""),
  });

  if (isLoading) return <div className="text-sm text-gray-500">과정 불러오는 중...</div>;

  const multipleSelection = "selectionRules" in props;
  const selectionRules = multipleSelection
    ? props.selectionRules
    : props.selectedUnit
      ? { [props.selectedUnit.coursePath]: true }
      : {};
  const onSelectionRulesChange: (
    rules: CourseSelectionRules,
    toggledUnit: CourseType
  ) => void = multipleSelection
    ? (rules) => props.onSelectionRulesChange(rules)
    : (rules: CourseSelectionRules, toggledUnit: CourseType) => {
        const selected = isCourseSelected(rules, toggledUnit.coursePath);
        props.setSelectedUnit(selected ? toggledUnit : undefined);
        const setLegacyUnits = props.setSelectedUnits as Dispatch<
          SetStateAction<SelectedUnitsGrade>
        >;
        const depth = toggledUnit.coursePath.length / 2;
        setLegacyUnits((current) => {
          if (!selected) {
            if (depth === 1) return {};
            if (depth === 2) {
              return { ...current, large: undefined, middle: undefined, small: undefined };
            }
            if (depth === 3) {
              return { ...current, middle: undefined, small: undefined };
            }
            return { ...current, small: undefined };
          }
          if (depth === 1) {
            return { grade: toggledUnit };
          }
          if (depth === 2) {
            return { ...current, large: toggledUnit, middle: undefined, small: undefined };
          }
          if (depth === 3) {
            return { ...current, middle: toggledUnit, small: undefined };
          }
          return { ...current, small: toggledUnit };
        });
      };

  return (
    <div>
      <p className="mb-3 text-xs text-gray-500">
        상위 단원을 선택하면 하위 단원이 모두 포함됩니다. 제외할 하위 단원만 체크를 해제하세요.
      </p>
      <ul className="max-h-[520px] space-y-1 overflow-y-auto pr-2">
        {gradeList.map((grade) => (
          <CourseTreeNode
            key={grade.coursePath}
            unit={grade}
            depth={1}
            selectionRules={selectionRules}
            onSelectionRulesChange={onSelectionRulesChange}
          />
        ))}
      </ul>
    </div>
  );
}

export default UnitSelectionByGrade;
