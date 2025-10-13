import { useEffect, useState } from "react";
import type {
  ResourcesResponsePagination,
  ResourceType,
} from "../types/resource";
import Pagination from "../../../shared/components/Pagination";
import ResourceItem from "./ResourceItem";
import ResourceListHeader from "./ResourceListHeader";
import { useNavigate } from "@tanstack/react-router";
import { getResourePagination } from "../apis/resource";

function ResourcePage() {
  const navigate = useNavigate();
  const [resourceListPagination, setResourceListPagination] =
    useState<ResourcesResponsePagination>({
      queryResults: [],
      currentPageNumber: 1,
      possibleNextPageNumbers: [],
    });
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [selectedResourceType, setSelectedResourceType] = useState<
    ResourceType | "all"
  >("all");

  useEffect(() => {
    const fetchData = async () => {
      const resourceListPaginationResponse = await getResourePagination(
        { title: keyword, resourceType: selectedResourceType },
        page
      );
      setResourceListPagination(resourceListPaginationResponse);
    };

    fetchData();
  }, [keyword, selectedResourceType]);

  const handleSearch = () => {
    console.log(`${keyword}`);
    // 여기서 검색 API 호출 또는 필터링 로직 실행
  };

  console.log(resourceListPagination);
  return (
    <div className="w-full max-w-[1680px] mx-auto mt-24 px-4">
      <nav className="flex justify-between items-center border-b border-gray-300">
        {/* 왼쪽 탭 */}
        <div className="flex space-x-4">
          {[
            { name: "전체", key: "all" },
            { name: "문제집", key: "testPaper" },
            { name: "내신 문제집", key: "schoolPaper" },
            { name: "영상", key: "video" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setSelectedResourceType(tab.key as ResourceType | "all");
              }}
              className={`py-2 px-4 font-medium cursor-pointer ${
                tab.key === selectedResourceType
                  ? "border-b-2 border-indigo-500 text-indigo-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* 오른쪽 글쓰기 버튼 */}
        <button
          onClick={() => navigate({ to: "/resource/write" })}
          className="py-2 px-4 bg-indigo-500 text-white rounded hover:bg-indigo-600 cursor-pointer mb-2"
        >
          자료 만들기
        </button>
      </nav>
      <div className="mt-6">
        <ResourceListHeader />
        {resourceListPagination.queryResults.map((resource, index) => (
          <ResourceItem
            key={resource.resourceId}
            resource={resource}
            index={index}
          />
        ))}
        {resourceListPagination && (
          <Pagination
            pageInfo={{
              currentPageNumber: resourceListPagination?.currentPageNumber,
              possibleNextPageNumbers:
                resourceListPagination?.possibleNextPageNumbers,
            }}
            setPage={setPage}
          />
        )}
      </div>

      {/* 검색 UI */}
      <div className="flex items-center mt-6 space-x-2 w-[600px] mx-auto">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="제목으로 검색하세요"
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

export default ResourcePage;
