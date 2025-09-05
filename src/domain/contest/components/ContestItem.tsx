import { difficultyToKorean } from "../../problem/utils/difficultyTransform";
import type { ContestResponseItem } from "../types/contest";

function ContestItem({
  contest,
  index,
}: {
  contest: ContestResponseItem;
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
          title={String(contest.contestId)}
        >
          {contest.contestId}
        </span>
      </div>
      <div className="inline-block align-middle w-[550px] text-center overflow-hidden truncate">
        <a
          className="text-sm text-blue-500 whitespace-nowrap mr-4"
          title={String(contest.contestName)}
          href={`/contests/${contest.contestId}`}
        >
          {contest.contestName}
        </a>
      </div>
      <div className="inline-block align-middle w-[400px] text-center overflow-hidden truncate">
        {/* {testPaper.courseInfo.courseName} */}
        <span className="ml-2 text-sm  whitespace-nowrap">
          {new Date(contest.startAt)
            .toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .replace(/\s/g, "")}{" "}
          ~{" "}
          {new Date(contest.endAt)
            .toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .replace(/\s/g, "")}
        </span>
      </div>
      <div className="inline-block align-middle w-[150px] text-center overflow-hidden truncate">
        <span
          className="text-sm text-black whitespace-nowrap"
          title={String(contest.difficulty)}
        >
          {difficultyToKorean(contest.difficulty)}
        </span>
      </div>
      <div className="inline-block align-middle w-[150px] text-center overflow-hidden truncate">
        <span
          className="text-sm text-black whitespace-nowrap"
          title={String(contest.distinctUserCount)}
        >
          {contest.distinctUserCount}
        </span>
      </div>
      <div className="inline-block align-middle w-[200px] text-center overflow-hidden truncate">
        <span
          className="text-sm text-black whitespace-nowrap"
          title={String(contest.minutes)}
        >
          {contest.minutes}분
        </span>
      </div>
    </div>
  );
}

export default ContestItem;
