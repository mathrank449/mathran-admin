import { useContestStore } from "../hooks/useContestStore";

export default function ContestNav() {
  const {
    selectedIndex,
    setSelectedIndex,
    contestProblems,
    addContestProblem,
    removeSelectedContestProblem,
  } = useContestStore();
  const testPapersLength = contestProblems.length;

  return (
    <div className="absolute left-4 top-24 z-5">
      <nav className="text-center  h-128 overflow-y-auto bg-gray-50 shadow-md rounded-xl mb-6">
        {Array.from({ length: testPapersLength }, (_, i) => {
          const isSelected = i === selectedIndex; // 현재 선택된 버튼
          return (
            <button
              key={i}
              className={`block my-3 mx-auto
              cursor-pointer px-3 py-2 rounded-lg shadow transition text-left
              ${
                isSelected
                  ? "bg-blue-500 text-white"
                  : "bg-white hover:bg-blue-50"
              }
            `}
              onClick={() => setSelectedIndex(i)}
            >
              문제 {i + 1}
            </button>
          );
        })}
      </nav>
      <div>
        <button
          className="bg-blue-600 px-6 py-1 cursor-pointer block mb-4"
          onClick={() => {
            addContestProblem();
          }}
        >
          <span className="text-white text-md">문항 추가</span>
        </button>
        <button
          className="bg-blue-600 px-6 py-1 cursor-pointer"
          onClick={() => {
            removeSelectedContestProblem();
          }}
        >
          <span className="text-white text-md block">문항 삭제</span>
        </button>
      </div>
    </div>
  );
}
