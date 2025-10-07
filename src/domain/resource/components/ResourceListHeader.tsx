function ResourceListHeader() {
  return (
    <div className="w-[1500px] custom-scrollbar whitespace-nowrap bg-white py-[10px] border-solid border-[#DEDEDE] border-2 mx-auto">
      <div className="w-[200px] inline-block text-center">
        <span className="text-black text-xl">번호</span>
      </div>
      <div className="w-[550px] inline-block text-center">
        <span className="text-black text-xl">제목</span>
      </div>
      <div className="w-[400px] inline-block text-center">
        <span className="text-black text-xl">카테고리</span>
      </div>
      <div className="w-[150px] inline-block text-center">
        <span className="text-black text-xl">가격</span>
      </div>
      <div className="w-[200px] inline-block text-center">
        <span className="text-black text-xl">작성일</span>
      </div>
    </div>
  );
}

export default ResourceListHeader;
