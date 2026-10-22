export const A4_PAGE_WIDTH = 595.28;
export const A4_PAGE_HEIGHT = 841.89;
export const PDF_MARGIN = 32;
export const PDF_HEADER_HEIGHT = 64;
export const PDF_COLUMN_GAP = 16;
export const PDF_PROBLEM_NUMBER_HEIGHT = 18;
export const PDF_MAX_GAP = Math.floor(
  A4_PAGE_HEIGHT - PDF_MARGIN * 2 - PDF_HEADER_HEIGHT
);

export interface PdfLayoutItem {
  itemIndex: number;
  aspectRatio: number;
  gapAfter: number;
}

export interface PdfPlacement {
  itemIndex: number;
  pageIndex: number;
  column: number;
  left: number;
  top: number;
  numberTop: number;
  width: number;
  height: number;
}

export interface PdfLayoutPlan {
  placements: PdfPlacement[];
  pageCount: number;
}

export class PdfLayoutError extends Error {}

/** 한 페이지에 넣을 최대 문항 수. null이면 공간이 허락하는 만큼 채운다. */
export type PdfMaxPerPage = null | 4 | 6;

export const planAssessmentPdf = (
  items: PdfLayoutItem[],
  columnCount: 1 | 2,
  maxPerPage: PdfMaxPerPage = null
): PdfLayoutPlan => {
  const columnWidth =
    (A4_PAGE_WIDTH -
      PDF_MARGIN * 2 -
      (columnCount - 1) * PDF_COLUMN_GAP) /
    columnCount;
  const placements: PdfPlacement[] = [];
  let page = 0;
  let column = 0;
  let top = PDF_MARGIN + PDF_HEADER_HEIGHT;
  let countInColumn = 0;
  // 2단이면 페이지 문항 수를 두 열에 나눈다 (4문제 → 열마다 2문제).
  const perColumn =
    maxPerPage === null ? null : Math.ceil(maxPerPage / columnCount);
  const columnBottom = A4_PAGE_HEIGHT - PDF_MARGIN;

  const pageTop = (pageIndex: number) =>
    pageIndex === 0 ? PDF_MARGIN + PDF_HEADER_HEIGHT : PDF_MARGIN;
  // 문항 수를 정하면 열을 같은 높이의 칸으로 나눠 각 문항을 칸 맨 위에 놓는다.
  const slotTop = (slot: number) =>
    perColumn === null
      ? pageTop(page)
      : pageTop(page) + ((columnBottom - pageTop(page)) / perColumn) * slot;
  const moveToNextColumnOrPage = () => {
    if (columnCount === 2 && column === 0) {
      column = 1;
    } else {
      page += 1;
      column = 0;
    }
    top = pageTop(page);
    countInColumn = 0;
  };

  for (const item of items) {
    if (!Number.isFinite(item.aspectRatio) || item.aspectRatio <= 0) {
      throw new PdfLayoutError(
        `${item.itemIndex + 1}번 문제 이미지 비율이 올바르지 않습니다.`
      );
    }

    const height = columnWidth / item.aspectRatio;
    const occupiedHeight = PDF_PROBLEM_NUMBER_HEIGHT + height;
    const fullPageCapacity = A4_PAGE_HEIGHT - PDF_MARGIN * 2;
    if (occupiedHeight > fullPageCapacity) {
      throw new PdfLayoutError(
        `${item.itemIndex + 1}번 문제 이미지는 가로 폭을 유지한 채 A4 한 페이지에 들어가지 않습니다.`
      );
    }

    if (perColumn !== null) {
      if (countInColumn >= perColumn) moveToNextColumnOrPage();
      top = Math.max(top, slotTop(countInColumn));
    }
    while (top + occupiedHeight > columnBottom) {
      moveToNextColumnOrPage();
    }

    placements.push({
      itemIndex: item.itemIndex,
      pageIndex: page,
      column,
      left: PDF_MARGIN + column * (columnWidth + PDF_COLUMN_GAP),
      top: top + PDF_PROBLEM_NUMBER_HEIGHT,
      numberTop: top,
      width: columnWidth,
      height,
    });
    countInColumn += 1;
    top += occupiedHeight + Math.min(PDF_MAX_GAP, Math.max(0, item.gapAfter));
  }

  return {
    placements,
    pageCount: items.length === 0 ? 1 : page + 1,
  };
};
