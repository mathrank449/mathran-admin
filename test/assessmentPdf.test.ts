import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { PDFDocument } from "pdf-lib";
import { describe, expect, test } from "vitest";
import { generateAssessmentPdf } from "../src/domain/testPaper/enrollTestPapers/services/assessmentPdf";
import { useTestPapersStore } from "../src/domain/testPaper/enrollTestPapers/hooks/useTestPapers";
import {
  A4_PAGE_WIDTH,
  PdfLayoutError,
  planAssessmentPdf,
} from "../src/domain/testPaper/enrollTestPapers/services/pdfLayoutPlanner";
import {
  canonicalAssessmentUrl,
  parseAssessmentId,
  type AssessmentPdfDraft,
  type AssessmentPdfProblem,
  toAssessmentRegisterPayload,
  validateAssessmentPdfDraft,
} from "../src/domain/testPaper/enrollTestPapers/types/assessmentPdf";

const problem = (
  id: string,
  overrides: Partial<AssessmentPdfProblem> = {}
): AssessmentPdfProblem =>
  ({
    id,
    problemImage: `problem-${id}.png`,
    difficulty: "MID",
    type: "MULTIPLE_CHOICE",
    score: 50,
    pdfGapAfter: 16,
    imageAspectRatio: 1847 / 631,
    ...overrides,
  } as AssessmentPdfProblem);

describe("assessment registration contract", () => {
  test("uses a 900-second answer lock and returns an assessment ID", () => {
    const draft: AssessmentPdfDraft = {
      title: " 7월 실전 모의고사 ",
      minutes: 60,
      columnCount: 1,
      items: [problem("10", { score: 100 })],
    };

    expect(toAssessmentRegisterPayload(draft)).toEqual({
      assessmentName: "7월 실전 모의고사",
      items: [{ problemId: 10, score: 100 }],
      minutes: 60,
      answerInputDelaySeconds: 900,
    });
    expect(parseAssessmentId({ assessmentId: "123" })).toBe("123");
    expect(parseAssessmentId(456)).toBe("456");
    expect(() => parseAssessmentId({})).toThrow(/assessmentId/);
  });

  test("validates time, score, and selected items", () => {
    const draft: AssessmentPdfDraft = {
      title: "시험지",
      minutes: 15,
      columnCount: 1,
      items: [problem("1", { score: 99 })],
    };
    expect(validateAssessmentPdfDraft(draft)).toContain("16분");
    expect(
      validateAssessmentPdfDraft({ ...draft, minutes: 60 })
    ).toContain("100점");
  });
});

describe("A4 layout planner", () => {
  test("fills the printable width in one-column mode", () => {
    const plan = planAssessmentPdf(
      [{ itemIndex: 0, aspectRatio: 2, gapAfter: 16 }],
      1
    );
    expect(plan.placements[0].width).toBeCloseTo(A4_PAGE_WIDTH - 64, 4);
    expect(plan.pageCount).toBe(1);
  });

  test("fills the left column before continuing in the right column", () => {
    const plan = planAssessmentPdf(
      [
        { itemIndex: 0, aspectRatio: 0.5, gapAfter: 12 },
        { itemIndex: 1, aspectRatio: 0.5, gapAfter: 12 },
      ],
      2
    );
    expect(plan.placements[0].width).toBeCloseTo(plan.placements[1].width, 4);
    expect(plan.placements[0].left).toBeLessThan(plan.placements[1].left);
    expect(plan.placements[0].top).toBeCloseTo(plan.placements[1].top, 4);
  });

  test("moves a full-width image to the next A4 page", () => {
    const plan = planAssessmentPdf(
      [
        { itemIndex: 0, aspectRatio: 0.8, gapAfter: 720 },
        { itemIndex: 1, aspectRatio: 0.8, gapAfter: 0 },
      ],
      1
    );
    expect(plan.pageCount).toBe(2);
    expect(plan.placements[1].pageIndex).toBe(1);
  });

  test("rejects an image that cannot fit at full column width", () => {
    expect(() =>
      planAssessmentPdf(
        [{ itemIndex: 0, aspectRatio: 0.1, gapAfter: 0 }],
        1
      )
    ).toThrow(PdfLayoutError);
  });
});

describe("assessment PDF editor state", () => {
  test("reorders selected problems and keeps the registered ID for layout-only edits", () => {
    useTestPapersStore.setState({
      testPapers: [problem("1"), problem("2"), problem("3")],
      selectedIndex: 0,
      columnCount: 1,
      createdAssessmentId: "999",
    });

    useTestPapersStore.getState().setTestPapersGap(400);
    useTestPapersStore.getState().setColumnCount(2);
    expect(useTestPapersStore.getState().createdAssessmentId).toBe("999");

    useTestPapersStore.getState().reorderTestPaper(0, 2);
    expect(useTestPapersStore.getState().testPapers.map((item) => item.id)).toEqual([
      "2",
      "3",
      "1",
    ]);
    expect(useTestPapersStore.getState().selectedIndex).toBe(2);
    expect(useTestPapersStore.getState().createdAssessmentId).toBeNull();
  });
});

describe("browser PDF generator", () => {
  test("creates an A4 PDF with MathRank CI, QR, and problem images", async () => {
    const logoBytes = new Uint8Array(
      readFileSync(resolve("public/mathrank_logo.png"))
    );
    const draft: AssessmentPdfDraft = {
      title: "PDF 시험지",
      minutes: 60,
      columnCount: 2,
      items: [problem("1"), problem("2")],
    };
    const generated = await generateAssessmentPdf({
      draft,
      assessmentId: "123",
      logoBytes,
      titleImageBytes: logoBytes,
      problemImages: [{ bytes: logoBytes }, { bytes: logoBytes }],
    });
    const parsed = await PDFDocument.load(generated.bytes);

    expect(generated.canonicalUrl).toBe(canonicalAssessmentUrl("123"));
    expect(generated.bytes.length).toBeGreaterThan(10_000);
    expect(parsed.getPageCount()).toBe(1);
    expect(parsed.getPage(0).getWidth()).toBeCloseTo(595.28, 1);
    expect(parsed.getPage(0).getHeight()).toBeCloseTo(841.89, 1);

    const verificationPath = process.env.MATHRANK_PDF_VERIFY_PATH;
    if (verificationPath) {
      writeFileSync(verificationPath, generated.bytes);
    }
  });
});
