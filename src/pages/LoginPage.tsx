import kakao_login from "../assests/kakao_login.png";
import google_login from "../assests/google_login.png";
import naver_login from "../assests/naver_login.png";
import mathran_logo from "/mathran_logo.png";

const kakaoClientId = import.meta.env.VITE_KAKAO_CLIENT_ID;

function LoginPage() {
  return (
    <div className="flex items-center justify-center mb-36">
      <div className="rounded-xl p-10 flex flex-col items-center gap-6">
        <div className="flex items-center gap-4">
          <img src={mathran_logo} />
          <h1 className="text-4xl font-bold text-gray-800">문항풀이 서비스</h1>
        </div>
        <button
          onClick={() => {
            window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoClientId}&redirect_uri=http://localhost:3000/redirect-kakao&response_type=code&state=1234`;
          }}
        >
          <img
            src={kakao_login}
            alt="카카오 로그인 버튼"
            className="w-82 cursor-pointer hover:scale-105 transition-transform"
          />
        </button>
        <img
          src={google_login}
          alt="구글 로그인 버튼"
          className="w-82 cursor-pointer hover:scale-105 transition-transform"
        />
        <img
          src={naver_login}
          alt="네이버 로그인 버튼"
          className="w-82 cursor-pointer hover:scale-105 transition-transform"
        />
      </div>
    </div>
  );
}

export default LoginPage;
