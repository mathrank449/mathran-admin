function ChallengeLogHeader() {
  return (
    <div className="w-[500px] custom-scrollbar whitespace-nowrap bg-gray-200 py-[10px] font-bold rounded-t-xl">
      <div className="w-[70px] inline-block text-left" />
      <div className="w-[100px] inline-block text-left">
        <span className="text-black text-md ">정답 여부</span>
      </div>
      <div className="w-[150px] inline-block text-center">
        <span className="text-black text-md">제출 정답</span>
      </div>
      <div className="w-[150px] inline-block text-center">
        <span className="text-black text-md">실제 정답</span>
      </div>
    </div>
  );
}

export default ChallengeLogHeader;
