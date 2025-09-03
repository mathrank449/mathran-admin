function SubmissionResultListHeader() {
  return (
    <div className="custom-scrollbar whitespace-nowrap bg-gray-200 py-[10px] font-bold mt-4">
      <div className="w-[100px] inline-block text-left" />
      <div className="w-[80px] inline-block text-center">
        <span className="text-black text-md ">점수</span>
      </div>
      <div className="w-[160px] inline-block text-center">
        <span className="text-black text-md">제출 정답</span>
      </div>
      <div className="w-[160px] inline-block text-center">
        <span className="text-black text-md">실제 정답</span>
      </div>
    </div>
  );
}

export default SubmissionResultListHeader;
