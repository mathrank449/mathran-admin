// contexts/AuthContext.ts
import { createContext } from "react";

export interface UserContextType {
  username: string | null;
  setUsername: (username: string) => void;
  removeUsername: () => void;
}

// ✅ context는 값 (runtime value)이므로 반드시 `const`로 export
export const UserContext = createContext<UserContextType | null>(null);
