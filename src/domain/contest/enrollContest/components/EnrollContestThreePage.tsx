import { useContestStore } from "../hooks/useContestStore";
import { AiOutlineCopy } from "react-icons/ai";
import { useNavigate } from "@tanstack/react-router";
import { enrollTestPapers } from "../apis/contest";
import { difficultyMap, problemMap } from "../../../problem/utils/problemMap";

const baseURL = import.meta.env.VITE_API_BASE_URL;

function EnrollContestThreePage() {
  const {
    contestProblems,
    selectedIndex,
    setSelectedIndex,
    setContestProblemScore,
    time,
    setTime,
    title,
    setTitle,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    clearSelectedContestProblem,
  } = useContestStore();
  const navigate = useNavigate();
  const problem = contestProblems[selectedIndex];

  if (problem === undefined) return <div>문제 없음</div>;

  return (
    <div className="flex justify-center">
      <div className="flex items-center gap-8">
        <button
          className="cursor-pointer w-10 h-10 flex items-center justify-center 
             rounded-full border border-gray-300 shadow-md 
             hover:bg-blue-500 hover:text-white 
             transition-colors duration-200"
          onClick={() => {
            if (0 > selectedIndex - 1) {
              alert("이전 문제가 없습니다.");
              return;
            }
            setSelectedIndex(selectedIndex - 1);
          }}
        >
          <span className="text-xl">&lt;</span>
        </button>

        <div className="p-4 flex flex-col gap-4 relative mb-36">
          {/* 제목 입력창 */}
          <div className="flex gap-4 items-center">
            {/* 문서 제목 */}
            <input
              type="text"
              placeholder="경시대회 제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-[3] focus:outline-none focus:ring-2 focus:ring-blue-400 px-2 rounded-md"
            />

            {/* 시간 제한 */}
            <div className="flex items-center gap-1 flex-[1]">
              <span className="text-sm">시간제한/</span>
              <input
                type="number"
                value={time}
                onChange={(e) => setTime(Number(e.target.value))}
                className="w-12 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md text-center"
              />
              <span className="text-sm">분</span>
            </div>
          </div>

          <hr />

          <div className="flex gap-4 items-center border-b-2 border-black">
            <div className="pb-3 flex-[3] focus:outline-none focus:ring-2 focus:ring-blue-400 px-2 rounded-md">
              <span className="font-bold mb-8 border-b-3 border-blue-400 pb-3">
                {selectedIndex + 1}번 문제
              </span>
            </div>

            {/* 시간 제한 */}
            <div className="flex items-center gap-1 flex-[1]">
              <span className="text-sm">점수/</span>
              <input
                type="number"
                value={problem.score}
                onChange={(e) => {
                  setContestProblemScore(Number(e.target.value));
                }}
                className="w-12 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md text-center"
              />
              <span className="text-sm">점</span>
            </div>
          </div>

          <div className="flex gap-6 items-center">
            {/* 시작 날짜 선택 */}
            <div className="flex items-center gap-2">
              <label htmlFor="startDate" className="text-sm font-medium">
                시작일자
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate ? startDate.split("T")[0] : ""}
                onChange={(e) => {
                  const date = e.target.value
                    ? `${e.target.value}T00:00:00`
                    : "";
                  setStartDate(date);
                }}
                className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* 종료 날짜 선택 */}
            <div className="flex items-center gap-2">
              <label htmlFor="endDate" className="text-sm font-medium">
                종료일자
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate ? endDate.split("T")[0] : ""}
                onChange={(e) => {
                  const date = e.target.value
                    ? `${e.target.value}T23:59:59`
                    : "";
                  setEndDate(date);
                }}
                className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <section className="relative w-[540px] mb-4 ml-[20px]">
            <div className="flex py-4">
              <div className="mr-12 flex flex-col gap-2 ml-4 items-center">
                <AiOutlineCopy size={24} className="mb-2 cursor-pointer" />
                <span className="text-md text-blue-400 px-2 font-bold rounded-lg bg-gray-100 text-center">
                  {difficultyMap[problem.difficulty]}
                </span>
                <span className="text-md text-gray-500 px-2 font-bold rounded-lg bg-gray-100 text-center">
                  {problemMap[problem.type]}
                </span>
              </div>
              <img
                className="w-48"
                src={`${baseURL}/v1/image?imageSource=${problem.problemImage}`}
                alt="문제 이미지"
              />
            </div>
          </section>

          <div className="flex gap-4 absolute bottom-[-120px] right-0">
            <button
              onClick={async () => {
                if (title == "") {
                  alert("경시대회 제목이 없습니다.");
                  return;
                }
                try {
                  // testPapers 안에 undefined 있는지 먼저 체크
                  const undefinedIndex = contestProblems.findIndex(
                    (p) => p === undefined
                  );

                  if (undefinedIndex !== -1) {
                    alert(
                      `${undefinedIndex + 1}번 문제 데이터가 비어있습니다.`
                    );
                    setSelectedIndex(undefinedIndex);
                    return;
                  }

                  const problems = contestProblems.map((problem) => ({
                    problemId: problem!.id,
                    score: problem!.score,
                  }));

                  // 총점 계산
                  const totalScore = problems.reduce(
                    (acc, cur) => acc + cur.score,
                    0
                  );

                  if (totalScore !== 100) {
                    alert(`총점은 100점이어야 합니다. (현재: ${totalScore}점)`);
                    return;
                  }

                  if (startDate === undefined || endDate === undefined) {
                    alert("시작 일자와 종료 일자를 선택해주세요.");
                    return;
                  }

                  await enrollTestPapers({
                    title,
                    problems,
                    time,
                    startAt: startDate,
                    endAt: endDate,
                  });
                  alert("경시대회 등록 완료");
                  navigate({ to: "/" });
                } catch (e) {
                  console.log(e);
                }
              }}
              className="cursor-pointer bg-blue-600 px-6 py-1 text-white text-md rounded-md w-auto"
            >
              등록 완료
            </button>
            <button
              onClick={() => {
                clearSelectedContestProblem();
              }}
              className="cursor-pointer   bg-blue-600 px-6 py-1 text-white text-md rounded-md w-auto"
            >
              이전
            </button>
          </div>
        </div>
        <button
          className="cursor-pointer w-10 h-10
             rounded-full border border-gray-300 shadow-md 
             hover:bg-blue-500 hover:text-white 
             transition-colors duration-200"
          onClick={() => {
            if (selectedIndex + 1 > contestProblems.length - 1) {
              alert("다음 문제가 없습니다.");
              return;
            }
            setSelectedIndex(selectedIndex + 1);
          }}
        >
          <span className="text-xl">&gt;</span>
        </button>
      </div>
    </div>
  );
}

export default EnrollContestThreePage;
