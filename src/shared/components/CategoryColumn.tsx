import { useNavigate } from "@tanstack/react-router";
import { AiOutlineRight } from "react-icons/ai";

type CategoryColumnProps = {
  title: string;
  items: {
    title: string;
    linkTo: string;
  }[];
};

export function CategoryColumn({ title, items }: CategoryColumnProps) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-start justify-start gap-4">
      <h2 className="text-2xl py-1 px-4">{title}</h2>
      {items.map((item) => (
        <button
          key={item.linkTo}
          className="inline-block cursor-pointer w-full text-left p-1 px-4 hover:bg-gray-600 hover:text-white"
          onClick={() => {
            navigate({ to: item.linkTo });
          }}
        >
          <AiOutlineRight className="inline-block" />
          <span>{item.title}</span>
        </button>
      ))}
    </div>
  );
}
