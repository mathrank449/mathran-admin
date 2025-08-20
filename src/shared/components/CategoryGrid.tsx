import { useNavigate } from "@tanstack/react-router";
import { AiOutlineRight } from "react-icons/ai";

type CategoryGridProps = {
  title: string;
  items: { title: string; linkTo: string }[];
};

export function CategoryGrid({ title, items }: CategoryGridProps) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-start justify-start gap-4">
      <h2 className="text-2xl py-1 px-4">{title}</h2>
      <div className="grid grid-cols-2 gap-2 w-full px-4">
        {items.map((item) => (
          <button
            key={item.linkTo}
            className="flex items-center gap-1 cursor-pointer text-left p-2 hover:bg-gray-600 hover:text-white rounded"
            onClick={() => {
              navigate({ to: item.linkTo });
            }}
          >
            <AiOutlineRight />
            <span>{item.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
