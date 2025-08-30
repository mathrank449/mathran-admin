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
      <div className="inline-block align-middle w-[550px] text-center overflow-hidden truncate">
        <a
          className="text-sm text-blue-500 whitespace-nowrap mr-4"
          title={String(testPaper.assessmentName)}
          href={`/test-papers/${testPaper.assessmentId}`}
        >
          {testPaper.assessmentName}
        </a>
        {/* <span>
          {problem.successAtFirstTry === true && (
            <span className="text-md px-3 py-1 rounded-xl border-solid border border-blue-500 bg-blue-500 text-white">
              성공
            </span>
          )}
          {problem.successAtFirstTry === false && (
            <span className="text-md px-3 py-1 rounded-xl border-solid border border-red-500 bg-red-500 text-white">
              실패
            </span>
          )}
        </span> */}
      </div>
      <div className="inline-block align-middle w-[400px] text-center overflow-hidden truncate">
        {/* {testPaper.courseInfo.courseName} */}
        <span className="text-sm text-black whitespace-nowrap" title={"중1-1"}>
          중1-1
        </span>
      </div>
      <div className="inline-block align-middle w-[150px] text-center overflow-hidden truncate">
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
