function RankingHeader() {
  return (
    <div className="w-[1650px] custom-scrollbar whitespace-nowrap bg-white py-[10px] border-solid border-[#DEDEDE] border-2">
      <div className="w-[200px] inline-block text-center">
        <span className="text-black text-xl">등수</span>
      </div>
      <div className="w-[450px] inline-block text-center">
        <span className="text-black text-xl">닉네임</span>
      </div>
      <div className="w-[550px] inline-block text-center">
        <span className="text-black text-xl">점수</span>
      </div>
      <div className="w-[150px] inline-block text-center">
        <span className="text-black text-xl">맞은 문제</span>
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

export default RankingHeader;
