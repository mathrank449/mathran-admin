function ChallengeLogHeader() {
  return (
    <div className="w-[1650px] custom-scrollbar whitespace-nowrap bg-white py-[10px] border-solid border-[#DEDEDE] border-2">
      <div className="w-[200px] inline-block text-center">
        <span className="text-black text-xl">제출 번호</span>
      </div>
      <div className="w-[550px] inline-block text-center">
        <span className="text-black text-xl">정답 여부</span>
      </div>
      <div className="w-[400px] inline-block text-center">
        <span className="text-black text-xl">제출 정답</span>
      </div>
      <div className="w-[150px] inline-block text-center">
        <span className="text-black text-xl">실제 정답</span>
      </div>
      <div className="w-[150px] inline-block text-center">
        <span className="text-black text-xl">풀이 시간</span>
      </div>
      <div className="w-[200px] inline-block text-center">
        <span className="text-black text-xl">등수</span>
      </div>
    </div>
  );
}

export default ChallengeLogHeader;
