import type { SetStateAction } from "react";
import type {
  SubmissionDetail,
  SubmissionLogItem,
} from "../types/submissionLog";
import { getSubmissionLogDetailBySubmissionId } from "../apis/submissionLog";

function SubmissionLogListItem({
  submissionLog,
  index,
  setSelectedLog,
  setDetailedSubmission,
  setSubmissionResult,
}: {
  submissionLog: SubmissionLogItem;
  index: number;
  setSelectedLog: React.Dispatch<SetStateAction<number | undefined>>;
  setDetailedSubmission: React.Dispatch<
    SetStateAction<SubmissionDetail | undefined>
  >;
  setSubmissionResult: React.Dispatch<
    SetStateAction<SubmissionLogItem | undefined>
  >;
}) {
  return (
    <div
      className={` mx-auto whitespace-nowrap py-2 font-bold cursor-pointer ${
        index % 2 === 0 ? "bg-white" : "bg-gray-100"
      }`}
      onClick={async () => {
        try {
          const submissionLogDetailResponse =
            await getSubmissionLogDetailBySubmissionId(
              String(submissionLog.submissionId)
            );
          setDetailedSubmission(submissionLogDetailResponse);
          setSelectedLog(index);
          setSubmissionResult(submissionLog);
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
      <div className="inline-block align-middle w-[130px] text-center overflow-hidden truncate">
        <div className="flex flex-col gap-1 text-left">
          <span className=" text-blue-500 whitespace-nowrap mr-4 text-md">
            {submissionLog.totalScore}점
          </span>
          <span
            className="text-sm text-black whitespace-nowrap"
            title={submissionLog.submittedAt}
          >
            {new Date(submissionLog.submittedAt)
              .toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
              .replace(/\s/g, "")}
          </span>
        </div>
      </div>
      <div className="inline-block align-middle w-[100px] text-center overflow-hidden truncate">
        {/* {testPaper.courseInfo.courseName} */}
        <span
          className="text-sm text-black whitespace-nowrap"
          title={String(submissionLog.assessmentAverageScore)}
        >
          {String(submissionLog.assessmentAverageScore)}점
        </span>
      </div>
      <div className="inline-block align-middle w-[200px] text-center overflow-hidden truncate">
        <span
          className="text-sm text-black whitespace-nowrap"
          title={`${Math.floor(submissionLog.elapsedTimeSeconds / 60)}분 ${
            submissionLog.elapsedTimeSeconds % 60
          }초`}
        >
          {`${Math.floor(submissionLog.elapsedTimeSeconds / 60)}분 ${
            submissionLog.elapsedTimeSeconds % 60
          }초`}
        </span>
      </div>
    </div>
  );
}

export default SubmissionLogListItem;
