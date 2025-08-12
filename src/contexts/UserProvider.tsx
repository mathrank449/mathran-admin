// contexts/AuthProvider.tsx
import { useState, type ReactNode } from "react";
import { UserContext } from "./UserContext";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState<string | null>(
    localStorage.getItem("mathrancloud_username")
  );

  // 로그인 함수
  const updateUsername = (username: string) => {
    localStorage.setItem("mathrancloud_username", username);
    setUsername(username);
  };

  // 로그아웃 함수
  const removeUsername = () => {
    localStorage.removeItem("mathrancloud_username");
    setUsername(null);
  };

  return (
    <UserContext.Provider
      value={{ username, setUsername: updateUsername, removeUsername }}
    >
      {children}
    </UserContext.Provider>
  );
};
