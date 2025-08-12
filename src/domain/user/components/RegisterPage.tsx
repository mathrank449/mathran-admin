// LoginPage.tsx
import { useState } from "react";
import RegisterForm from "./RegisterForm";
import type { RegisterFormData } from "../types/oauth";

const RegisterPage = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    memberType: "STUDENT",
    nickname: "",
    schoolCode: "",
    schoolName: "",
    schoolLocation: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 여기에 로그인 로직 작성
    console.log(formData);
  };
  return (
    <div className="w-[720px] flex flex-col items-center justify-between bg-[#F8F8F8] p-24 pt-12 shadow-lg">
      <div className="w-full text-center mb-8">
        <h1 className="text-4xl text-gray-800 mb-8">회원가입</h1>
        <span>
          가입을 하면 사이트의
          <a href="/privacy-policy" className="pl-1 text-md text-blue-400">
            이용약관, 개인정보처리법
          </a>
          에 동의하게 됩니다.
        </span>
        <hr className="w-full h-px bg-black border-0 mt-12" />
      </div>
      <RegisterForm
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

export default RegisterPage;
