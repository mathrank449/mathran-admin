import type { SetStateAction } from "react";
import type { PageInfo } from "../type/Page";

function Pagination({
  pageInfo,
  setPage,
}: {
  pageInfo: PageInfo;
  setPage: React.Dispatch<SetStateAction<number>>;
}) {
  let pages;
  if (
    pageInfo.possibleNextPageNumbers.length > 0 &&
    pageInfo.currentPageNumber > 1
  ) {
    pages = [
      pageInfo.currentPageNumber - 1,
      pageInfo.currentPageNumber,
      pageInfo.currentPageNumber + 1,
    ];
  } else if (
    pageInfo.currentPageNumber > 1 &&
    pageInfo.possibleNextPageNumbers.length === 0
  ) {
    pages = [pageInfo.currentPageNumber - 1, pageInfo.currentPageNumber];
  } else if (
    pageInfo.currentPageNumber === 1 &&
    pageInfo.possibleNextPageNumbers.length > 0
  ) {
    pages = [pageInfo.currentPageNumber, pageInfo.currentPageNumber + 1];
  } else {
    pages = [pageInfo.currentPageNumber];
  }
  return (
    <div className="flex justify-center mt-6 gap-2">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => {
            setPage(page);
          }}
          className={`px-4 py-2 rounded border cursor-pointer ${
            pageInfo.currentPageNumber === page
              ? "bg-blue-500 text-white"
              : "bg-white text-black"
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
}

export default Pagination;
