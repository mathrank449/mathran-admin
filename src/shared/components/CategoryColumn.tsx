import { AiOutlineRight } from "react-icons/ai";

type CategoryColumnProps = {
  title: string;
  items: string[];
};

export function CategoryColumn({ title, items }: CategoryColumnProps) {
  return (
    <div className="flex flex-col items-start justify-start gap-4">
      <h2 className="text-2xl py-1 px-4">{title}</h2>
      {items.map((item) => (
        <button
          key={item}
          className="inline-block cursor-pointer w-full text-left p-1 px-4 hover:bg-gray-600 hover:text-white"
        >
          <AiOutlineRight className="inline-block" />
          <span>{item}</span>
        </button>
      ))}
    </div>
  );
}
