import { CategoryColumn } from "./CategoryColumn";
import { CategoryGrid } from "./CategoryGrid";

type ProblemNavProps = {
  isVisible: boolean;
};

export function ProblemNav({ isVisible }: ProblemNavProps) {
  if (!isVisible) return null;

  return (
    <div className="absolute top-full left-0 w-full px-6">
      <div className="flex justify-center gap-36 bg-white shadow-lg z-10 border-t-2 border-blue-500 pb-12 pt-4">
        {/* 일반 문제 */}
        <CategoryColumn
          title="문제"
          items={["전체 문제", "최신 문제", "인기 문제", "우리 학교 예상 문제"]}
        />

        {/* 유형별 문제 */}
        <CategoryColumn
          title="문제"
          items={["난이도별로 풀어보기", "단원별로 풀어보기"]}
        />

        {/* 지역별 문제 */}
        <CategoryGrid
          title="지역별 문제"
          items={[
            "서울",
            "대전",
            "부산",
            "경기",
            "대구",
            "충남",
            "광주",
            "강원도",
          ]}
        />

        {/* 기출 문제 */}
        <CategoryGrid
          title="기출 문제"
          items={[
            "수능",
            "고3 모의고사",
            "고2 모의고사",
            "고1 모의고사",
            "전국연합학력평가",
          ]}
        />
      </div>
    </div>
  );
}
