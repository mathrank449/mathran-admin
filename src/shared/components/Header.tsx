import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AiOutlineDown } from "react-icons/ai";
import { ProblemNav } from "./ProblemNav";
import { MoreNav } from "./MoreNav";
import { useAuthStore } from "../stores/user";
import { logout } from "../../domain/user/apis/auth";
import { useUser } from "../../domain/user/hooks/useUser";

export function Header() {
  const navigate = useNavigate();
  const [isHoveringProblemNav, setIsHoveringProblemNav] = useState(false);
  const [isHoveringMoreNav, setIsHoveringMoreNav] = useState(false);
  const userInfo = useAuthStore((state) => state.userInfo);
  const isLogin = useAuthStore((state) => state.isLogin);
  const { handleLogout } = useUser();

  return (
    <header className="relative px-6 bg-white text-[#8E8E8E] border-t-[0px] border-b-[1px] border-[#8E8E8E] min-w-[1680px]">
      {isLogin ? (
        <div className="absolute right-8 top-2">
          <span> {userInfo?.userName}</span>
          <span className="mx-2">|</span>
          <button
            className="cursor-pointer"
            onClick={async () => {
              try {
                await handleLogout(); // logout 함수가 Promise를 반환해야 함
                navigate({ to: "/login" });
              } catch (e: unknown) {
                if (e instanceof Error) alert("로그아웃 실패: " + e.message);
              }
            }}
          >
            <span>로그아웃</span>
          </button>
        </div>
      ) : (
        <div className="absolute right-8 top-2">
          <button className="cursor-pointer">
            <span>회원가입 </span>
          </button>
          <span className="mx-2">|</span>
          <button
            className="cursor-pointer"
            onClick={() => {
              navigate({ to: "/login" });
            }}
          >
            <span>로그인</span>
          </button>
        </div>
      )}

      <button
        className="cursor-pointer"
        onClick={() => {
          navigate({ to: "/" });
        }}
      >
        <img src="/mathran_logo.png" className="absolute w-20 left-4 top-1" />
      </button>
      <nav className="flex items-center justify-center gap-16 pt-4">
        <div
          className="py-4"
          onMouseEnter={() => setIsHoveringProblemNav(true)}
          onMouseLeave={() => setIsHoveringProblemNav(false)}
        >
          <span className="text-lg">문제</span>
          <AiOutlineDown className="inline-block ml-2 mb-1" />
          {/* 드롭다운 메뉴 */}
          <ProblemNav isVisible={isHoveringProblemNav} />
        </div>
        <button
          className="text-lg cursor-pointer py-4"
          onClick={() => {
            navigate({ to: "/test-papers" });
          }}
        >
          시험지
        </button>
        <button
          className="text-lg cursor-pointer  py-4"
          onClick={() => {
            navigate({ to: "/contests" });
          }}
        >
          대회
        </button>
        <button
          className="text-lg cursor-pointer  py-4"
          onClick={() => {
            navigate({ to: "/rankings" });
          }}
        >
          랭킹
        </button>
        <button
          className="text-lg cursor-pointer  py-4"
          onClick={() => {
            navigate({ to: "/forum" });
          }}
        >
          게시판
        </button>
        <button
          className="text-lg cursor-pointer  py-4"
          onClick={() => {
            navigate({ to: "/resources" });
          }}
        >
          자료실
        </button>
        <div
          className="py-4 relative"
          onMouseEnter={() => setIsHoveringMoreNav(true)}
          onMouseLeave={() => setIsHoveringMoreNav(false)}
        >
          <span className="text-lg">더보기</span>
          <AiOutlineDown className="inline-block ml-2 mb-1" />
          {/* 드롭다운 메뉴 */}
          <MoreNav isVisible={isHoveringMoreNav} />
        </div>
      </nav>
    </header>
  );
}
// 5%
