// LoginPage.tsx
import { useMutation, useQuery } from "@tanstack/react-query";
import Button from "../../../shared/components/Button";
import InputBox from "../../../shared/components/InputBox";
import { AiOutlineSearch } from "react-icons/ai";
import { register } from "../apis/auth";
import type { RegisterFormData } from "../types/oauth";
import { useNavigate } from "@tanstack/react-router";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { getSchoolList } from "../apis/school";

interface RegisterFormProps {
  formData: RegisterFormData;
  setFormData: React.Dispatch<React.SetStateAction<RegisterFormData>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const RegisterForm = ({
  formData,
  setFormData,
  handleSubmit,
}: RegisterFormProps) => {
  const navigate = useNavigate();

  const [searchedSchoolname, setSearchedSchoolname] = useState<string>("");
  const [searchedSchooLlist, setSearchedSchooLlist] = useState<
    {
      schoolName: string;
      schoolCode: string;
      schoolKind: string;
      schoolLocation: string;
    }[]
  >([]);

  const { data: schoolList } = useQuery({
    queryKey: [`v1/schools`, searchedSchoolname],
    queryFn: ({ queryKey }) => getSchoolList(queryKey[1]),
  });

  useEffect(() => {
    if (schoolList) {
      setSearchedSchooLlist(schoolList);
    }
  }, [schoolList]);

  const registerMutation = useMutation({
    mutationFn: (formData: RegisterFormData) => register(formData),
    onSuccess: (data) => {
      alert("회원가입이 완료되었습니다.");
      navigate({ to: "/" });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        alert("회원가입에 실패하였습니다.");
        navigate({ to: "/login" });
      }
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target === null) return;
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto rounded-2xl space-y-4 w-full"
    >
      <div>
        <label
          className="block mb-1 text-lg font-semibold text-gray-700"
          htmlFor="username"
        >
          닉네임
        </label>
        <InputBox
          type="text"
          id="nickname"
          value={formData.nickname}
          name="nickname"
          handleChange={handleChange}
        />
      </div>
      {/* 소속 입력 */}
      <div>
        <label className="block text-lg mb-3 font-semibold text-gray-700">
          소속
        </label>
        <div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="memberType"
                value="STUDENT"
                checked={formData.memberType === "STUDENT"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    memberType: e.target
                      .value as RegisterFormData["memberType"],
                  }))
                }
              />
              학생
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="memberType"
                value="TEACHER"
                checked={formData.memberType === "TEACHER"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    memberType: e.target
                      .value as RegisterFormData["memberType"],
                  }))
                }
              />
              선생님
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="memberType"
                value="GENERAL"
                checked={formData.memberType === "GENERAL"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    memberType: e.target
                      .value as RegisterFormData["memberType"],
                  }))
                }
              />
              N수생 / 일반인
            </label>
          </div>
        </div>
      </div>
      {formData.memberType !== "GENERAL" && (
        <div>
          <label className="block text-lg mb-3 font-semibold text-gray-700">
            학교
          </label>
          <div className="flex gap-8 ">
            <div>
              <div className="relative mb-2">
                <input
                  type="text"
                  placeholder="학교명 입력"
                  onChange={(e) => {
                    setSearchedSchoolname(e.target.value);
                  }}
                  className="w-full border px-3 py-2 rounded text-sm pr-10 text-black"
                />
                <AiOutlineSearch className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                readOnly
                value={formData.schoolName}
                className="w-full border px-3 py-2 rounded bg-white text-sm "
              />
            </div>
            {/* 체크박스 학교 리스트 */}
            <div className="w-full h-[85px] text-sm text-gray-800 flex flex-wrap gap-2 overflow-auto border-solid border-[#D2D2D2] border-2 p-3 rounded-lg">
              {searchedSchooLlist.map((school, i) => (
                <label key={i} className="flex items-center gap-2">
                  {school.schoolName}({school.schoolLocation})
                  <input
                    type="radio"
                    name="school"
                    value={school.schoolName}
                    onChange={() => {
                      // 학교, 지역 선택
                      setFormData((prev) => ({
                        ...prev,
                        schoolCode: school.schoolCode,
                        schoolName: school.schoolName,
                        location: school.schoolLocation,
                      }));
                    }}
                  />
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      <Button
        type="submit"
        handleClick={() => {
          registerMutation.mutate(formData);
        }}
        text="회원가입"
      />
    </form>
  );
};

export default RegisterForm;
