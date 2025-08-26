function ProblemListHeader() {
  return (
    <div className="w-[1650px] custom-scrollbar whitespace-nowrap bg-white py-[10px] border-solid border-[#DEDEDE] border-2">
      <div className="w-[150px] inline-block text-center">
        <span className="text-black text-xl">문제 번호</span>
      </div>
      <div className="w-[500px] inline-block text-center">
        <span className="text-black text-xl">문제 제목</span>
      </div>
      <div className="w-[400px] inline-block text-center">
        <span className="text-black text-xl">과정</span>
      </div>
      <div className="w-[150px] inline-block text-center">
        <span className="text-black text-xl">난이도</span>
      </div>
      <div className="w-[150px] inline-block text-center">
        <span className="text-black text-xl">맞힌 사람</span>
      </div>
      <div className="w-[150px] inline-block text-center">
        <span className="text-black text-xl">제출</span>
      </div>
      <div className="w-[150px] inline-block text-center">
        <span className="text-black text-xl">정답 비율</span>
      </div>
    </div>
  );
}

export default ProblemListHeader;
