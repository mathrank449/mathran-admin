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
            { title: "최신 문제", linkTo: "/problems/new" },
            { title: "인기 문제", linkTo: "/problems/popular" },
            { title: "우리 학교 예상 문제", linkTo: "/problems/school" },
          ]}
        />

        {/* 유형별 문제 */}
        <CategoryColumn
          title="문제"
          items={[
            { title: "단원별로 풀어보기", linkTo: "/problems/course" },
            {
              title: "틀린 문제 다시 풀어보기",
              linkTo: "/problems/incorrect",
            },
            {
              title: "맞춘 문제 다시 풀어보기",
              linkTo: "/problems/correct",
            },
          ]}
        />

        {/* 지역별 문제 */}
        <CategoryGrid
          title="지역별 문제"
          items={[
            { title: "서울", linkTo: "/problems/seoul" },
            { title: "부산", linkTo: "/problems/busan" },
            { title: "대구", linkTo: "/problems/daegu" },
            { title: "인천", linkTo: "/problems/incheon" },
            { title: "광주", linkTo: "/problems/gwangju" },
            { title: "대전", linkTo: "/problems/daejeon" },
            { title: "울산", linkTo: "/problems/ulsan" },
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
