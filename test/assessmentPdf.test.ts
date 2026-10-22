import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { PDFDocument } from "pdf-lib";
import { describe, expect, test } from "vitest";
import { generateAssessmentPdf, problemNumberLabel } from "../src/domain/testPaper/enrollTestPapers/services/assessmentPdf";
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
  test("registers an unlimited assessment with immediate answer input", () => {
    const draft: AssessmentPdfDraft = {
      title: " 7월 실전 모의고사 ",
      minutes: 60,
      columnCount: 1,
      maxPerPage: null,
      items: [problem("10", { score: 100 })],
    };

    expect(toAssessmentRegisterPayload(draft)).toEqual({
      assessmentName: "7월 실전 모의고사",
      items: [{ problemId: 10, score: 100 }],
      minutes: 60,
      answerInputDelaySeconds: 0,
    });
    expect(parseAssessmentId({ assessmentId: "123" })).toBe("123");
    expect(parseAssessmentId(456)).toBe("456");
    expect(() => parseAssessmentId({})).toThrow(/assessmentId/);
  });

  test("validates time, score, and selected items", () => {
    const draft: AssessmentPdfDraft = {
      title: "시험지",
      minutes: 0,
      columnCount: 1,
      maxPerPage: null,
      items: [problem("1", { score: 99 })],
    };
    expect(validateAssessmentPdfDraft(draft)).toContain("호환용");
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

describe("PDF problem numbers", () => {
  test("shows the number without a trailing dot", () => {
    expect(problemNumberLabel(0)).toBe("1");
    expect(problemNumberLabel(11)).toBe("12");
  });
});

describe("PDF problems per page", () => {
  const short = (count: number, aspectRatio = 4) =>
    Array.from({ length: count }, (_, itemIndex) => ({
      itemIndex,
      aspectRatio,
      gapAfter: 0,
    }));
  const perPage = (plan: ReturnType<typeof planAssessmentPdf>) =>
    Array.from(
      { length: plan.pageCount },
      (_, page) => plan.placements.filter((p) => p.pageIndex === page).length
    );

  test("puts at most 4 problems on a page and moves the rest to the next page", () => {
    const plan = planAssessmentPdf(short(10), 1, 4);
    expect(perPage(plan)).toEqual([4, 4, 2]);
  });

  test("splits the page limit across two columns", () => {
    const plan = planAssessmentPdf(short(7), 2, 6);
    expect(perPage(plan)).toEqual([6, 1]);
    const firstPage = plan.placements.filter((p) => p.pageIndex === 0);
    expect(firstPage.filter((p) => p.column === 0)).toHaveLength(3);
    expect(firstPage.filter((p) => p.column === 1)).toHaveLength(3);
  });

  test("spreads problems over equal slots instead of packing them at the top", () => {
    const plan = planAssessmentPdf(short(2), 1, 4);
    const [first, second] = plan.placements;
    const slotHeight = (841.89 - 32 - (32 + 64)) / 4;
    expect(second.numberTop - first.numberTop).toBeCloseTo(slotHeight, 1);
  });

  test("tall problems still push to the next page before the limit", () => {
    const tall = Array.from({ length: 4 }, (_, itemIndex) => ({
      itemIndex,
      aspectRatio: 1,
      gapAfter: 0,
    }));
    const plan = planAssessmentPdf(tall, 1, 4);
    expect(plan.pageCount).toBeGreaterThan(1);
    expect(Math.max(...perPage(plan))).toBeLessThanOrEqual(4);
  });

  test("keeps the old packing when no limit is set", () => {
    expect(planAssessmentPdf(short(10, 8), 1).pageCount).toBe(
      planAssessmentPdf(short(10, 8), 1, null).pageCount
    );
    expect(perPage(planAssessmentPdf(short(10, 8), 1))[0]).toBeGreaterThan(4);
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

  test("applies one gap value to every selected problem", () => {
    useTestPapersStore.setState({
      testPapers: [problem("1"), problem("2"), problem("3")],
      selectedIndex: 0,
      createdAssessmentId: "999",
    });

    useTestPapersStore.getState().setAllTestPapersGap(72);

    expect(
      useTestPapersStore.getState().testPapers.map((item) => item.pdfGapAfter)
    ).toEqual([72, 72, 72]);
    expect(useTestPapersStore.getState().createdAssessmentId).toBe("999");
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
      maxPerPage: null,
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

  test("creates a contest PDF without a QR code", async () => {
    const logoBytes = new Uint8Array(
      readFileSync(resolve("public/mathrank_logo.png"))
    );
    const generated = await generateAssessmentPdf({
      draft: {
        columnCount: 1,
        maxPerPage: 4,
        items: [problem("1"), problem("2"), problem("3"), problem("4"), problem("5")],
      },
      assessmentId: null,
      logoBytes,
      titleImageBytes: logoBytes,
      problemImages: Array.from({ length: 5 }, () => ({ bytes: logoBytes })),
    });
    const parsed = await PDFDocument.load(generated.bytes);

    expect(generated.canonicalUrl).toBeNull();
    expect(parsed.getPageCount()).toBe(2);
  });
});
