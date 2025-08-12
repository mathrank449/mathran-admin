interface InputBoxProps {
  type: React.HTMLInputTypeAttribute; // 또는 더 제한적으로 명시할 수도 있음
  id: string;
  value: string;
  name: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function InputBox({ type, id, value, name, handleChange }: InputBoxProps) {
  return (
    <input
      type={type}
      id={id}
      value={value}
      name={name}
      onChange={handleChange}
      className="w-full bg-white px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
    />
  );
}

export default InputBox;
