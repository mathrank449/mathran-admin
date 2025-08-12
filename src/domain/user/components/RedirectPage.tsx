import { useEffect } from "react";
import { useUser } from "../hooks/useUser";

interface RedirectPageProps {
  code?: string;
  error?: Error;
}

function RedirectPage({ code, error }: RedirectPageProps) {
  const { handleLogin } = useUser();
  useEffect(() => {
    handleLogin({ provider: "KAKAO", code: code || "", state: "1234" });
  }, []);

  return (
    <div>
      <h1>RedirectPage</h1>
      {code && <p>Code: {code}</p>}
      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
    </div>
  );
}

export default RedirectPage;
