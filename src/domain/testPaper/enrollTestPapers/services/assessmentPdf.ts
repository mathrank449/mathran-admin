import { PDFDocument, type PDFImage } from "pdf-lib";
import QRCode from "qrcode";
import type { AssessmentPdfDraft } from "../types/assessmentPdf";
import { canonicalAssessmentUrl } from "../types/assessmentPdf";
import {
  A4_PAGE_HEIGHT,
  A4_PAGE_WIDTH,
  PDF_HEADER_HEIGHT,
  PDF_MARGIN,
  planAssessmentPdf,
} from "./pdfLayoutPlanner";

export interface AssessmentPdfImage {
  bytes: Uint8Array;
}

export interface GeneratedAssessmentPdf {
  bytes: Uint8Array;
  pageCount: number;
  canonicalUrl: string;
}

const dataUrlToBytes = (dataUrl: string): Uint8Array => {
  const separator = dataUrl.indexOf(",");
  if (separator < 0) {
    throw new Error("QR 이미지 데이터를 읽을 수 없습니다.");
  }
  const binary = atob(dataUrl.slice(separator + 1));
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
};

const embedImage = async (
  document: PDFDocument,
  bytes: Uint8Array
): Promise<PDFImage> => {
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return document.embedPng(bytes);
  }
  if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xd8) {
    return document.embedJpg(bytes);
  }
  throw new Error("PDF는 PNG 또는 JPEG 문제 이미지만 지원합니다.");
};

export const generateAssessmentPdf = async ({
  draft,
  assessmentId,
  logoBytes,
  titleImageBytes,
  problemImages,
}: {
  draft: AssessmentPdfDraft;
  assessmentId: string;
  logoBytes: Uint8Array;
  titleImageBytes: Uint8Array;
  problemImages: AssessmentPdfImage[];
}): Promise<GeneratedAssessmentPdf> => {
  if (problemImages.length !== draft.items.length) {
    throw new Error("선택한 문항 수와 내려받은 이미지 수가 일치하지 않습니다.");
  }

  const plan = planAssessmentPdf(
    draft.items.map((item, itemIndex) => ({
      itemIndex,
      aspectRatio: item.imageAspectRatio,
      gapAfter: item.pdfGapAfter,
    })),
    draft.columnCount
  );
  const canonicalUrl = canonicalAssessmentUrl(assessmentId);
  const qrDataUrl = await QRCode.toDataURL(canonicalUrl, {
    margin: 0,
    width: 256,
    errorCorrectionLevel: "M",
  });

  const document = await PDFDocument.create();
  const logo = await embedImage(document, logoBytes);
  const titleImage = await embedImage(document, titleImageBytes);
  const qr = await document.embedPng(dataUrlToBytes(qrDataUrl));
  const images: PDFImage[] = [];
  for (const image of problemImages) {
    images.push(await embedImage(document, image.bytes));
  }

  for (let pageIndex = 0; pageIndex < plan.pageCount; pageIndex += 1) {
    const page = document.addPage([A4_PAGE_WIDTH, A4_PAGE_HEIGHT]);
    if (pageIndex === 0) {
      page.drawImage(logo, {
        x: PDF_MARGIN,
        y: A4_PAGE_HEIGHT - PDF_MARGIN - 36,
        width: 126,
        height: 36,
      });
      page.drawImage(qr, {
        x: A4_PAGE_WIDTH - PDF_MARGIN - 48,
        y: A4_PAGE_HEIGHT - PDF_MARGIN - 48,
        width: 48,
        height: 48,
      });
      page.drawImage(titleImage, {
        x: 172,
        y: A4_PAGE_HEIGHT - PDF_MARGIN - 34,
        width: 251,
        height: 33.5,
      });
      page.drawLine({
        start: { x: PDF_MARGIN, y: A4_PAGE_HEIGHT - PDF_MARGIN - 56 },
        end: {
          x: A4_PAGE_WIDTH - PDF_MARGIN,
          y: A4_PAGE_HEIGHT - PDF_MARGIN - 56,
        },
        thickness: 0.8,
      });
    }

    if (draft.columnCount === 2) {
      page.drawLine({
        start: { x: A4_PAGE_WIDTH / 2, y: PDF_MARGIN },
        end: {
          x: A4_PAGE_WIDTH / 2,
          y:
            pageIndex === 0
              ? A4_PAGE_HEIGHT - PDF_MARGIN - PDF_HEADER_HEIGHT
              : A4_PAGE_HEIGHT - PDF_MARGIN,
        },
        thickness: 0.8,
      });
    }

    for (const placement of plan.placements.filter(
      (candidate) => candidate.pageIndex === pageIndex
    )) {
      page.drawImage(images[placement.itemIndex], {
        x: placement.left,
        y: A4_PAGE_HEIGHT - placement.top - placement.height,
        width: placement.width,
        height: placement.height,
      });
    }
  }

  return {
    bytes: await document.save(),
    pageCount: plan.pageCount,
    canonicalUrl,
  };
};

export const downloadPdf = (bytes: Uint8Array, filename: string) => {
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
};
