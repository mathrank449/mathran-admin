import { useEffect, useState } from "react";
import type { RankInfoPagination } from "../types/rank";
import { getRankAll } from "../apis/rank";
import RankingHeader from "./RankingHeader";
import RankingItem from "./RankingItem";
import Pagination from "../../../shared/components/Pagination";

function RankingListPage() {
  const [rankginListPagination, setRankginListPagination] = useState<
    RankInfoPagination | undefined
  >(undefined);
  const [page, setPage] = useState(1);
  useEffect(() => {
    const fetchData = async () => {
      const rankginListResponse = await getRankAll(page);
      setRankginListPagination(rankginListResponse);
    };
    fetchData();
  }, []);

  if (rankginListPagination === undefined) return null;
  return (
    <div className="flex flex-col items-center gap-24">
      <div className="text-left pl-12 bg-gray-50 text-3xl py-6 w-full">
        랭킹
      </div>
      <div>
        <RankingHeader />
        {rankginListPagination?.queryResults?.map((rankingItem, index) => (
          <RankingItem rankingItem={rankingItem} index={index} />
        ))}
        <Pagination
          pageInfo={{
            currentPageNumber: rankginListPagination?.currentPageNumber,
            possibleNextPageNumbers:
              rankginListPagination?.possibleNextPageNumbers,
          }}
          setPage={setPage}
        />
      </div>
    </div>
  );
}

export default RankingListPage;
