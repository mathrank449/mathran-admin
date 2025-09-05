function ContestHeader() {
  return (
    <div className="w-[1650px] custom-scrollbar whitespace-nowrap bg-white py-[10px] border-solid border-[#DEDEDE] border-2">
      <div className="w-[200px] inline-block text-center">
        <span className="text-black text-xl">문제집 번호</span>
      </div>
      <div className="w-[550px] inline-block text-center">
        <span className="text-black text-xl">문제집 제목</span>
      </div>
      <div className="w-[400px] inline-block text-center">
        <span className="text-black text-xl">대회기간</span>
      </div>
      <div className="w-[150px] inline-block text-center">
        <span className="text-black text-xl">난이도</span>
      </div>
      <div className="w-[150px] inline-block text-center">
        <span className="text-black text-xl">제출</span>
      </div>
      <div className="w-[200px] inline-block text-center">
        <span className="text-black text-xl">제한 시간</span>
      </div>
    </div>
  );
}

export default ContestHeader;
