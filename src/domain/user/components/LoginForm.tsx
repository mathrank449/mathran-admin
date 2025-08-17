// LoginPage.tsx
import { useMutation } from "@tanstack/react-query";
import Button from "../../../shared/components/Button";
import InputBox from "../../../shared/components/InputBox";
import { login } from "../apis/auth";
import type { LoginFormData } from "../types/user.ts";
import instance from "../../../shared/apis/instance.ts";
import { useNavigate } from "@tanstack/react-router";
import { AxiosError } from "axios";
import { useContext } from "react";
import { UserContext } from "../../../shared/contexts/UserContext.ts";

interface LoginFormProps {
  formData: LoginFormData;
  setFormData: React.Dispatch<React.SetStateAction<LoginFormData>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const LoginForm = ({ formData, setFormData, handleSubmit }: LoginFormProps) => {
  const user = useContext(UserContext);
  if (!user) {
    throw new Error("useUsername must be used within AuthProvider");
  }
  const { setUsername } = user;
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: (loginData: { loginId: string; password: string }) =>
      login(loginData.loginId, loginData.password),
    onSuccess: (data) => {
      instance.defaults.headers.common["Authorization"] = `${data.accessToken}`;
      localStorage.setItem("mathrancloud_username", data.userName);
      alert("로그인에 성공하였습니다.");
      navigate({ to: "/" });
      setUsername(data.userName);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        alert("로그인에 실패하였습니다.");
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
          className="block mb-1 font-semibold text-gray-700"
          htmlFor="username"
        >
          아이디
        </label>
        <InputBox
          type="text"
          id="id"
          value={formData.id}
          name="id"
          handleChange={handleChange}
        />
      </div>

      <div>
        <label
          className="block mb-1 font-semibold text-gray-700"
          htmlFor="password"
        >
          비밀번호
        </label>
        <InputBox
          type="password"
          id="password"
          value={formData.password}
          name="password"
          handleChange={handleChange}
        />
      </div>
      <Button
        type="submit"
        handleClick={() => {
          loginMutation.mutate({
            loginId: formData.id,
            password: formData.password,
          });
        }}
        text="로그인"
      />
    </form>
  );
};

export default LoginForm;
