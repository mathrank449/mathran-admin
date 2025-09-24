import { useEffect, useState } from "react";
import BoardNav from "./BoardNav";
import QuestionListHeader from "../list/components/QuestionListHeader";
import QuestionItem from "../list/components/QuestionItem";
import Pagination from "../../../shared/components/Pagination";
import type { QuestionPostsResponsePagination } from "../types/question";
import { getAllSolutionBoard } from "../apis/solutionBoard";

function SolutionProblemBoardPage({ problemId }: { problemId?: string }) {
  const [questionListPagination, setQuestionListPagination] =
    useState<QuestionPostsResponsePagination>({
      queryResults: [],
      currentPageNumber: 1,
      possibleNextPageNumbers: [],
    });
  const [page, setPage] = useState(1);
  const [searchType, setSearchType] = useState("문제 번호");
  console.log(problemId);
  const [keyword, setKeyword] = useState(problemId ?? "");

  const handleSearch = () => {
    console.log(`검색: ${searchType} -> ${keyword}`);
    // 여기서 검색 API 호출 또는 필터링 로직 실행
  };

  useEffect(() => {
    const fetchData = async () => {
      if (searchType == "문제 번호") {
        const questionListPaginationResponse = await getAllSolutionBoard(
          {
            postType: "SINGLE_PROBLEM",
            singleProblemId: keyword,
            title: "",
            nickName: "",
          },
          page
        );
        setQuestionListPagination(questionListPaginationResponse);
      }
      if (searchType == "작성자") {
        const questionListPaginationResponse = await getAllSolutionBoard(
          { postType: "SINGLE_PROBLEM", title: "", nickName: keyword },
          page
        );
        setQuestionListPagination(questionListPaginationResponse);
      }

      if (searchType == "글제목") {
        const questionListPaginationResponse = await getAllSolutionBoard(
          { postType: "SINGLE_PROBLEM", title: keyword, nickName: "" },
          page
        );
        setQuestionListPagination(questionListPaginationResponse);
      }
    };
    fetchData();
  }, [searchType, keyword]);

  return (
    <div className="w-[1680px] mx-auto mt-24 px-4">
      <BoardNav title="문제" />
      <div className="mt-6">
        <QuestionListHeader />
        {questionListPagination.queryResults.map((question, index) => (
          <QuestionItem question={question} index={index} />
        ))}
        {questionListPagination && (
          <Pagination
            pageInfo={{
              currentPageNumber: questionListPagination?.currentPageNumber,
              possibleNextPageNumbers:
                questionListPagination?.possibleNextPageNumbers,
            }}
            setPage={setPage}
          />
        )}
      </div>
      {/* 검색 UI */}
      <div className="flex items-center mt-6 space-x-2 w-[600px] mx-auto">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="작성자">작성자</option>
          <option value="글제목">글제목</option>
          <option value="문제 번호">문제 번호</option>
        </select>

        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="검색어를 입력하세요"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <button
          onClick={handleSearch}
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 cursor-pointer"
        >
          검색
        </button>
      </div>
    </div>
  );
}

export default SolutionProblemBoardPage;
