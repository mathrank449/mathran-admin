interface ButtonProps {
  type: "button" | "submit" | "reset"; // 기본 HTML button type
  handleClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; // 클릭 이벤트 (선택적)
  text: string;
}

function Button({ type, handleClick, text }: ButtonProps) {
  return (
    <button
      type={type}
      className="w-full py-2 px-4 bg-[#3665FF] text-white rounded-lg 
             hover:bg-[#2e58e6] hover:brightness-110 
             transition duration-200 ease-in-out 
             transform hover:-translate-y-0.5 
             cursor-pointer"
      onClick={handleClick}
    >
      {text}
    </button>
  );
}

export default Button;
