import { useState } from "react";
import type { AssessmentPdfProblem } from "../types/assessmentPdf";
import {
  A4_PAGE_HEIGHT,
  A4_PAGE_WIDTH,
  PDF_COLUMN_GAP,
  PDF_HEADER_HEIGHT,
  PDF_MARGIN,
  PDF_PROBLEM_NUMBER_HEIGHT,
  planAssessmentPdf,
} from "../services/pdfLayoutPlanner";
import { getProblemImageUrl } from "../services/problemImage";

const PREVIEW_WIDTH = 500;
const SCALE = PREVIEW_WIDTH / A4_PAGE_WIDTH;

interface AssessmentPdfPreviewProps {
  title: string;
  items: AssessmentPdfProblem[];
  columnCount: 1 | 2;
  selectedIndex: number;
  onSelectItem: (index: number) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export default function AssessmentPdfPreview({
  title,
  items,
  columnCount,
  selectedIndex,
  onSelectItem,
  onReorder,
}: AssessmentPdfPreviewProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const plan = planAssessmentPdf(
    items.map((item, itemIndex) => ({
      itemIndex,
      aspectRatio: item.imageAspectRatio,
      gapAfter: item.pdfGapAfter,
    })),
    columnCount
  );

  return (
    <div className="min-w-0">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">PDF 미리보기</h2>
          <p className="mt-1 text-sm text-gray-500">
            문항을 끌어 다른 문항 위에 놓으면 순서가 바뀝니다.
          </p>
        </div>
        <span className="text-sm text-gray-500">{plan.pageCount}페이지 · {columnCount}단</span>
      </div>

      <div className="max-h-[1120px] overflow-y-auto pr-3">
        <div className="flex flex-col items-center gap-7">
          {Array.from({ length: plan.pageCount }, (_, pageIndex) => (
            <div
              key={pageIndex}
              className="relative shrink-0 overflow-hidden bg-white shadow-[0_8px_30px_rgba(15,23,42,0.14)] ring-1 ring-gray-300"
              style={{
                width: PREVIEW_WIDTH,
                height: A4_PAGE_HEIGHT * SCALE,
              }}
            >
              {pageIndex === 0 && (
                <>
                  <img
                    src="/mathrank_logo.png"
                    alt="MathRank CI"
                    className="absolute object-contain"
                    style={{
                      left: PDF_MARGIN * SCALE,
                      top: PDF_MARGIN * SCALE,
                      width: 126 * SCALE,
                      height: 36 * SCALE,
                    }}
                  />
                  <div
                    className="absolute flex items-center justify-center overflow-hidden px-2 text-center font-bold text-gray-900"
                    style={{
                      left: 172 * SCALE,
                      top: PDF_MARGIN * SCALE,
                      width: 251 * SCALE,
                      height: 36 * SCALE,
                      fontSize: 14,
                    }}
                  >
                    {title.trim() || "시험지 제목"}
                  </div>
                  <div
                    className="absolute grid place-items-center border border-gray-900 bg-white text-[9px] font-bold text-gray-700"
                    style={{
                      right: PDF_MARGIN * SCALE,
                      top: PDF_MARGIN * SCALE,
                      width: 48 * SCALE,
                      height: 48 * SCALE,
                    }}
                  >
                    QR
                  </div>
                  <div
                    className="absolute bg-black"
                    style={{
                      left: PDF_MARGIN * SCALE,
                      right: PDF_MARGIN * SCALE,
                      top: (PDF_MARGIN + 56) * SCALE,
                      height: 1,
                    }}
                  />
                </>
              )}

              {columnCount === 2 && (
                <div
                  className="absolute bg-black"
                  style={{
                    left: (A4_PAGE_WIDTH / 2) * SCALE,
                    top:
                      (pageIndex === 0
                        ? PDF_MARGIN + PDF_HEADER_HEIGHT
                        : PDF_MARGIN) * SCALE,
                    bottom: PDF_MARGIN * SCALE,
                    width: 1,
                  }}
                />
              )}

              {plan.placements
                .filter((placement) => placement.pageIndex === pageIndex)
                .map((placement) => {
                  const item = items[placement.itemIndex];
                  const active = placement.itemIndex === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      draggable
                      onClick={() => onSelectItem(placement.itemIndex)}
                      onDragStart={(event) => {
                        setDraggedIndex(placement.itemIndex);
                        event.dataTransfer.effectAllowed = "move";
                        event.dataTransfer.setData(
                          "text/plain",
                          String(placement.itemIndex)
                        );
                      }}
                      onDragEnd={() => setDraggedIndex(null)}
                      onDragOver={(event) => {
                        event.preventDefault();
                        event.dataTransfer.dropEffect = "move";
                      }}
                      onDrop={(event) => {
                        event.preventDefault();
                        const fromIndex = Number(
                          event.dataTransfer.getData("text/plain")
                        );
                        if (Number.isInteger(fromIndex)) {
                          onReorder(fromIndex, placement.itemIndex);
                        }
                        setDraggedIndex(null);
                      }}
                      className={`absolute cursor-grab overflow-visible bg-white p-0 active:cursor-grabbing ${
                        active ? "outline-2 outline-offset-2 outline-gray-900" : ""
                      } ${draggedIndex === placement.itemIndex ? "opacity-45" : ""}`}
                      style={{
                        left: placement.left * SCALE,
                        top: placement.numberTop * SCALE,
                        width: placement.width * SCALE,
                        height:
                          (placement.height + PDF_PROBLEM_NUMBER_HEIGHT) * SCALE,
                      }}
                      aria-label={`${placement.itemIndex + 1}번 문항 선택 및 순서 이동`}
                    >
                      <img
                        src={getProblemImageUrl(item.problemImage)}
                        alt={`${placement.itemIndex + 1}번 문제`}
                        className="pointer-events-none absolute bottom-0 left-0 w-full object-contain"
                        style={{ height: placement.height * SCALE }}
                      />
                      <span
                        className="absolute left-0 top-0 text-left font-bold text-gray-900"
                        style={{
                          height: PDF_PROBLEM_NUMBER_HEIGHT * SCALE,
                          fontSize: 11 * SCALE,
                        }}
                      >
                        {placement.itemIndex + 1}.
                      </span>
                    </button>
                  );
                })}

              {columnCount === 2 && (
                <span
                  className="absolute text-[8px] text-gray-300"
                  style={{
                    left: (A4_PAGE_WIDTH / 2 + PDF_COLUMN_GAP / 2) * SCALE,
                    bottom: 5,
                  }}
                >
                  {pageIndex + 1}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
