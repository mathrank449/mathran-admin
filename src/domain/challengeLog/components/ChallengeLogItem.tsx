import type { SetStateAction } from "react";
import type { ChallengeLog, ChallengeLogDetail } from "../types/challengeLog";
import { getDetailedChallengeLogByChallengeLogId } from "../apis/challengeLog";

function ChallengeLogItem({
  challengeLog,
  index,
  setSelectedLog,
  setDetailedLog,
}: {
  challengeLog: ChallengeLog;
  index: number;
  setSelectedLog: React.Dispatch<SetStateAction<number | undefined>>;
  setDetailedLog: React.Dispatch<
    SetStateAction<ChallengeLogDetail | undefined>
  >;
}) {
  return (
    <div
      className={`w-[500px] whitespace-nowrap py-2 font-bold cursor-pointer ${
        index % 2 === 0 ? "bg-white" : "bg-gray-100"
      }`}
      onClick={async () => {
        try {
          const challengeLogDetailResponse =
            await getDetailedChallengeLogByChallengeLogId(
              challengeLog.challengeLogId
            );
          setDetailedLog(challengeLogDetailResponse);
          setSelectedLog(index);
        } catch (e) {
          console.log(e);
        }
      }}
    >
      <div className="inline-block align-middle w-[70px] text-left pl-4 overflow-hidden truncate">
        <span
          className="text-sm text-black whitespace-nowrap"
          title={String(index + 1)}
        >
          {index + 1}
        </span>
      </div>
      <div className="inline-block align-middle w-[100px] text-center overflow-hidden truncate">
        {challengeLog.success && (
          <div className="flex flex-col gap-1 text-left">
            <span className=" text-blue-500 whitespace-nowrap mr-4 text-md">
              성공
            </span>
            <span
              className="text-sm text-black whitespace-nowrap"
              title={challengeLog.submittedAt}
            >
              {new Date(challengeLog.submittedAt)
                .toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })
                .replace(/\s/g, "")}
            </span>
          </div>
        )}
        {!challengeLog.success && (
          <div className="flex flex-col gap-1 text-left">
            <span className=" text-red-500 whitespace-nowrap mr-4 text-md">
              실패
            </span>
            <span
              className="text-sm text-black whitespace-nowrap"
              title={challengeLog.submittedAt}
            >
              {new Date(challengeLog.submittedAt)
                .toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })
                .replace(/\s/g, "")}
            </span>
          </div>
        )}
      </div>
      <div className="inline-block align-middle w-[150px] text-center overflow-hidden truncate">
        {/* {testPaper.courseInfo.courseName} */}
        <span
          className="text-sm text-black whitespace-nowrap"
          title={challengeLog.submittedAnswer.join(", ")}
        >
          {challengeLog.submittedAnswer.join(", ")}
        </span>
      </div>
      <div className="inline-block align-middle w-[150px] text-center overflow-hidden truncate">
        <span
          className="text-sm text-black whitespace-nowrap"
          title={challengeLog.correctAnswer.join(", ")}
        >
          {challengeLog.correctAnswer.join(", ")}
        </span>
      </div>
    </div>
  );
}

export default ChallengeLogItem;
