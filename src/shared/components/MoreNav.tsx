import { AiOutlineRight } from "react-icons/ai";

type MoreNavProps = {
  isVisible: boolean;
};

export function MoreNav({ isVisible }: MoreNavProps) {
  if (!isVisible) return null;

  return (
    <div className="absolute top-full left-0 w-64">
      <div className="bg-white shadow-lg z-10 border-t-2 border-blue-500 pt-4 pb-12">
        {/* 일반 문제 */}

        {["개인 정보 처리 방침"].map((item) => (
          <button
            key={item}
            className="inline-block cursor-pointer w-full text-left p-1 px-4 hover:bg-gray-600 hover:text-white"
          >
            <AiOutlineRight className="inline-block" />
            <span>{item}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
