import { CategoryColumn } from "./CategoryColumn";
import { CategoryGrid } from "./CategoryGrid";

type ProblemNavProps = {
  isVisible: boolean;
};

export function ProblemNav({ isVisible }: ProblemNavProps) {
  if (!isVisible) return null;
  console.log(isVisible);

  return (
    <div className="absolute top-full left-0 w-full px-6">
      <div className="flex justify-center gap-36 bg-white shadow-lg z-10 border-t-2 border-blue-500 pb-12 pt-4">
        {/* 일반 문제 */}
        <CategoryColumn
          title="문제"
          items={[
            { title: "전체 문제", linkTo: "/problems" },
            { title: "최신 문제", linkTo: "/problems" },
            { title: "인기 문제", linkTo: "/problems" },
            { title: "우리 학교 예상 문제", linkTo: "/problems" },
          ]}
        />

        {/* 유형별 문제 */}
        <CategoryColumn
          title="문제"
          items={[
            { title: "난이도별로 풀어보기", linkTo: "/problems" },
            { title: "단원별로 풀어보기", linkTo: "/problems" },
          ]}
        />

        {/* 지역별 문제 */}
        <CategoryGrid
          title="지역별 문제"
          items={[
            { title: "서울", linkTo: "problems" },
            { title: "대전", linkTo: "" },
            { title: "부산", linkTo: "" },
            { title: "경기", linkTo: "" },
            { title: "대구", linkTo: "" },
            { title: "충남", linkTo: "" },
            { title: "광주", linkTo: "" },
            { title: "강원도", linkTo: "" },
          ]}
        />

        {/* 기출 문제 */}
        <CategoryGrid
          title="기출 문제"
          items={[
            { title: "수능", linkTo: "" },
            { title: "고3 모의고사", linkTo: "" },
            { title: "고2 모의고사", linkTo: "" },
            { title: "고1 모의고사", linkTo: "" },
            { title: "전국연합학력평가", linkTo: "" },
          ]}
        />
      </div>
    </div>
  );
}
