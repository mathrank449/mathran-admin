export const A4_PAGE_WIDTH = 595.28;
export const A4_PAGE_HEIGHT = 841.89;
export const PDF_MARGIN = 32;
export const PDF_HEADER_HEIGHT = 64;
export const PDF_COLUMN_GAP = 16;
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
  width: number;
  height: number;
}

export interface PdfLayoutPlan {
  placements: PdfPlacement[];
  pageCount: number;
}

export class PdfLayoutError extends Error {}

export const planAssessmentPdf = (
  items: PdfLayoutItem[],
  columnCount: 1 | 2
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

  const pageTop = (pageIndex: number) =>
    pageIndex === 0 ? PDF_MARGIN + PDF_HEADER_HEIGHT : PDF_MARGIN;
  const moveToNextColumnOrPage = () => {
    if (columnCount === 2 && column === 0) {
      column = 1;
    } else {
      page += 1;
      column = 0;
    }
    top = pageTop(page);
  };

  for (const item of items) {
    if (!Number.isFinite(item.aspectRatio) || item.aspectRatio <= 0) {
      throw new PdfLayoutError(
        `${item.itemIndex + 1}번 문제 이미지 비율이 올바르지 않습니다.`
      );
    }

    const height = columnWidth / item.aspectRatio;
    const fullPageCapacity = A4_PAGE_HEIGHT - PDF_MARGIN * 2;
    if (height > fullPageCapacity) {
      throw new PdfLayoutError(
        `${item.itemIndex + 1}번 문제 이미지는 가로 폭을 유지한 채 A4 한 페이지에 들어가지 않습니다.`
      );
    }

    while (top + height > A4_PAGE_HEIGHT - PDF_MARGIN) {
      moveToNextColumnOrPage();
    }

    placements.push({
      itemIndex: item.itemIndex,
      pageIndex: page,
      column,
      left: PDF_MARGIN + column * (columnWidth + PDF_COLUMN_GAP),
      top,
      width: columnWidth,
      height,
    });
    top += height + Math.min(PDF_MAX_GAP, Math.max(0, item.gapAfter));
  }

  return {
    placements,
    pageCount: items.length === 0 ? 1 : page + 1,
  };
};
