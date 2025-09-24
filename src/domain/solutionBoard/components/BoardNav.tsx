import { useNavigate } from "@tanstack/react-router";

function BoardNav({ title }: { title: string }) {
  const tabs = [
    { title: "전체", path: "/solution-board/list/all" },
    { title: "자유", path: "/solution-board/list/free" },
    { title: "공지", path: "/solution-board/list/notice" },
    { title: "문제", path: "/solution-board/question/problem" },
    { title: "문제집", path: "/solution-board/question/testPaper" },
    { title: "대회", path: "/solution-board/question/contest" },
  ];
  const navigate = useNavigate();

  return (
    <nav className="flex justify-between items-center border-b border-gray-300">
      {/* 왼쪽 탭 */}
      <div className="flex space-x-4">
        {tabs.map((tab) => (
          <button
            key={tab.path}
            onClick={() => navigate({ to: `${tab.path}` })}
            className={`py-2 px-4 font-medium cursor-pointer ${
              title === tab.title
                ? "border-b-2 border-indigo-500 text-indigo-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* 오른쪽 글쓰기 버튼 */}
      <button
        onClick={() => navigate({ to: "/solution-board/write/question" })}
        className="py-2 px-4 bg-indigo-500 text-white rounded hover:bg-indigo-600 cursor-pointer mb-2"
      >
        글쓰기
      </button>
    </nav>
  );
}

export default BoardNav;
