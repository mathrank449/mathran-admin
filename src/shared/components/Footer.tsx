const address = "서울특별시 강남구 테헤란로 215, 10층";
const name = "김민수";
const businessNumber = "123-45-67890";
const representativePhoneNumber = "02-3456-7890";
const email = "contact@samplecorp.com";

function Footer() {
  return (
    <div>
      <hr className="bg-gray-300 h-[1px] border-0" />
      <footer className="bg-[#fff] py-8 relative flex justify-center text-[#666]">
        <div className="relative">
          {/* 회사 정보 */}
          <div className="text-xs">
            <div className="mb-2">
              <span className="font-medium">주소: </span>{" "}
              <span className="mr-6">{address}</span>
              <span className="font-medium">대표: </span>{" "}
              <span className="mr-6">{name}</span>
            </div>
            <div className="mt-2">
              <span className="font-medium">사업자등록번호: </span>
              <span className="mr-6">{businessNumber}</span>
              <span className="font-medium">대표전화: </span>
              <span className="mr-6">{representativePhoneNumber}</span>
              <span className="font-medium">이메일: </span>
              <a href={`mailto:${email}`} className="text-blue-600 underline">
                {email}
              </a>
            </div>
          </div>
        </div>
        {/* 하단 카피라이트 */}
        <div className="my-2 absolute text-xs text-rbGrayText bottom-2 right-2">
          © {new Date().getFullYear()}All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Footer;
