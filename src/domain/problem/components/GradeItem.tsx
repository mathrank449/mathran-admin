type GradeItemProps = {
  text: string;
  handleClick?: () => void;
  selected?: boolean; // 선택 여부
};

function GradeItem({ text, handleClick, selected = false }: GradeItemProps) {
  return (
    <button
      onClick={handleClick}
      className={`px-4 py-1 rounded-xl border-solid border cursor-pointer 
        ${
          selected
            ? "border-blue-500 bg-blue-500 text-white"
            : "border-gray-200 text-black"
        }
      `}
    >
      <span className="text-lg">{text}</span>
    </button>
  );
}

export default GradeItem;
