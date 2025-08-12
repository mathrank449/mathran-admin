// LoginPage.tsx
import { useState } from "react";
import LoginForm from "./LoginForm";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    id: "",
    password: "",
    rememberMe: false,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 여기에 로그인 로직 작성
    console.log(formData);
  };
  return (
    <div className="min-w-[630px] flex flex-col items-center justify-between bg-[#F8F8F8] p-24 pt-12 shadow-lg">
      <div className="w-full text-center mb-16">
        <h1 className="text-4xl text-gray-800 mb-8">로그인</h1>
        <hr className="w-full h-px bg-black border-0" />
      </div>
      <LoginForm
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
      />
      <div className="w-full mt-12">
        <hr className="w-full h-px bg-black border-0" />
      </div>
    </div>
  );
};

export default LoginPage;
