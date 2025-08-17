import { AiOutlineRight } from "react-icons/ai";
import { useNavigate } from "@tanstack/react-router";

type MoreEnrollNavProps = {
  isVisible: boolean;
};

export function EnrollNav({ isVisible }: MoreEnrollNavProps) {
  const navigate = useNavigate();

  if (!isVisible) return null;

  // 아이템별 이동 경로 맵
  const pathMap: Record<string, string> = {
    "개별 문제": "/enroll-problem",
    문제집: "/enroll-test-papers",
    대회: "/enroll-contests",
  };

  return (
    <div className="absolute top-full left-0 w-64">
      <div className="bg-white shadow-lg z-10 border-t-2 border-blue-500 pt-4 pb-12">
        {["개별 문제", "문제집", "대회"].map((item) => (
          <button
            key={item}
            className="inline-block cursor-pointer w-full text-left p-1 px-4 hover:bg-gray-600 hover:text-white"
            onClick={() => {
              const path = pathMap[item];
              if (path) navigate({ to: path });
            }}
          >
            <AiOutlineRight className="inline-block" />
            <span>{item}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
