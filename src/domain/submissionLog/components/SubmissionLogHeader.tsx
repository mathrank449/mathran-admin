function SubmissionLogHeader() {
  return (
    <div className=" mx-auto custom-scrollbar whitespace-nowrap bg-gray-200 py-[10px] font-bold rounded-t-xl">
      <div className="w-[70px] inline-block text-left" />
      <div className="w-[130px] inline-block text-left">
        <span className="text-black text-md ">내 점수</span>
      </div>
      <div className="w-[100px] inline-block text-center">
        <span className="text-black text-md">평균 점수</span>
      </div>
      <div className="w-[200px] inline-block text-center">
        <span className="text-black text-md">풀이 시간</span>
      </div>
    </div>
  );
}

export default SubmissionLogHeader;
