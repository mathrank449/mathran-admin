import { difficultyToKorean } from "../../problem/utils/difficultyTransform";
import type { TestPaperResponseItem } from "../types/testPaper";

function TestPaperItem({
  testPaper,
  index,
}: {
  testPaper: TestPaperResponseItem;
  index: number;
}) {
  return (
    <div
      className={`w-[1650px] whitespace-nowrap py-3 border-solid border-[#DEDEDE] border-2 border-t-0 ${
        index % 2 === 0 ? "bg-white " : " bg-gray-100"
      }`}
    >
      <div className="inline-block align-middle w-[200px] text-center overflow-hidden truncate">
        <span
          className="text-sm text-black whitespace-nowrap"
          title={String(testPaper.assessmentId)}
        >
          {testPaper.assessmentId}
        </span>
      </div>
      <div className="inline-block align-middle w-[850px] text-center overflow-hidden truncate">
        <a
          className="text-sm text-blue-500 whitespace-nowrap mr-4"
          title={String(testPaper.assessmentName)}
          href={`/test-papers/${testPaper.assessmentId}`}
        >
          {testPaper.assessmentName}
        </a>
      </div>
      <div className="inline-block align-middle w-[250px] text-center overflow-hidden truncate">
        <span
          className="text-sm text-black whitespace-nowrap"
          title={String(testPaper.difficulty)}
        >
          {difficultyToKorean(testPaper.difficulty)}
        </span>
      </div>
      <div className="inline-block align-middle w-[150px] text-center overflow-hidden truncate">
        <span
          className="text-sm text-black whitespace-nowrap"
          title={String(testPaper.distinctUserCount)}
        >
          {testPaper.distinctUserCount}
        </span>
      </div>
      <div className="inline-block align-middle w-[200px] text-center overflow-hidden truncate">
        <span
          className="text-sm text-black whitespace-nowrap"
          title={String(testPaper.minutes)}
        >
          {testPaper.minutes}분
        </span>
      </div>
    </div>
  );
}

export default TestPaperItem;
