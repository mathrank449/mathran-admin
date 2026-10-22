import type { AssessmentPdfProblem } from "../types/assessmentPdf";
import { PDF_MAX_GAP, type PdfMaxPerPage } from "../services/pdfLayoutPlanner";

interface PdfLayoutControlsProps {
  items: AssessmentPdfProblem[];
  onSetAllGap: (gapAfter: number) => void;
  columnCount: 1 | 2;
  onColumnCount: (columnCount: 1 | 2) => void;
  maxPerPage: PdfMaxPerPage;
  onMaxPerPage: (maxPerPage: PdfMaxPerPage) => void;
}

const segmentClassName = (active: boolean) =>
  `whitespace-nowrap rounded-md px-4 py-2 text-sm font-semibold ${
    active ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"
  }`;

/** 시험지·경시대회 PDF 편집 화면이 함께 쓰는 문항 간격·단·페이지당 문항 수 설정 */
export default function PdfLayoutControls({
  items,
  onSetAllGap,
  columnCount,
  onColumnCount,
  maxPerPage,
  onMaxPerPage,
}: PdfLayoutControlsProps) {
  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-800">전체 문항 간격</p>
            <p className="mt-1 text-xs text-gray-500">
              모든 문항에 같은 간격을 적용한 뒤 필요한 문항만 개별 조정할 수 있습니다.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            {[
              ["최소", 0],
              ["보통", 24],
              ["최대", PDF_MAX_GAP],
            ].map(([label, gap]) => (
              <button
                key={label}
                type="button"
                onClick={() => onSetAllGap(Number(gap))}
                className="whitespace-nowrap rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <input
            aria-label="전체 문항 간격"
            type="range"
            min={0}
            max={PDF_MAX_GAP}
            step={4}
            value={items[0]?.pdfGapAfter ?? 0}
            onChange={(event) => onSetAllGap(Number(event.target.value))}
            className="w-full accent-gray-900"
          />
          <span className="w-16 text-right text-xs text-gray-600">
            {items.every((item) => item.pdfGapAfter === items[0]?.pdfGapAfter)
              ? `${items[0]?.pdfGapAfter ?? 0}pt`
              : "개별값"}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-gray-800">페이지 구성</p>
          <p className="text-xs text-gray-500">2단은 왼쪽 열부터 자동 배치됩니다.</p>
        </div>
        <div className="flex shrink-0 rounded-lg border border-gray-300 bg-white p-1">
          {([1, 2] as const).map((count) => (
            <button
              key={count}
              type="button"
              onClick={() => onColumnCount(count)}
              className={segmentClassName(columnCount === count)}
            >
              {count}단
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-gray-800">페이지당 문항 수</p>
          <p className="text-xs text-gray-500">
            칸을 나눠 고르게 배치하고, 넘치는 문항은 다음 장으로 넘깁니다.
          </p>
        </div>
        <div className="flex shrink-0 rounded-lg border border-gray-300 bg-white p-1">
          {([null, 4, 6] as const).map((count) => (
            <button
              key={count ?? "auto"}
              type="button"
              onClick={() => onMaxPerPage(count)}
              className={segmentClassName(maxPerPage === count)}
            >
              {count === null ? "자동" : `최대 ${count}문제`}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
