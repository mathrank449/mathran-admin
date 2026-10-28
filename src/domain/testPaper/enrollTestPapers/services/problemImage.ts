import instance from "../../../../shared/apis/instance";

export const getProblemImageUrl = (imageSource: string) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  return `${baseUrl}/v1/image?imageSource=${encodeURIComponent(imageSource)}`;
};

export const loadImageAspectRatio = (imageSource: string): Promise<number> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      if (image.naturalWidth <= 0 || image.naturalHeight <= 0) {
        reject(new Error("문제 이미지 크기를 확인할 수 없습니다."));
        return;
      }
      resolve(image.naturalWidth / image.naturalHeight);
    };
    image.onerror = () => reject(new Error("문제 이미지를 불러오지 못했습니다."));
    image.src = getProblemImageUrl(imageSource);
  });

// 문제은행에서 변환한 이미지는 회색 가장자리 없이 흑백 두 색으로만 되어 있어,
// PDF 뷰어가 크게 그리거나 인쇄하면 글자가 계단처럼 깨진다.
// 흰 바탕 위에 2배로 부드럽게 키워 가장자리 중간색을 만든 뒤 PDF에 넣는다.
const PRINT_SCALE = 2;
const MAX_PRINT_WIDTH = 3000;

const smoothForPrint = async (bytes: Uint8Array): Promise<Uint8Array> => {
  const bitmap = await createImageBitmap(new Blob([bytes]));
  const scale = Math.min(PRINT_SCALE, MAX_PRINT_WIDTH / bitmap.width);
  if (scale <= 1) {
    bitmap.close();
    return bytes;
  }
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    return bytes;
  }
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png")
  );
  return blob ? new Uint8Array(await blob.arrayBuffer()) : bytes;
};

// PDF에 넣을 문제 이미지를 받는다. 인쇄용으로 부드럽게 키운 PNG를 돌려준다.
export const downloadProblemImage = async (
  imageSource: string
): Promise<Uint8Array> => {
  const response = await instance.get<ArrayBuffer>("/v1/image", {
    params: { imageSource },
    responseType: "arraybuffer",
  });
  return smoothForPrint(new Uint8Array(response.data));
};

export const downloadMathRankLogo = async (): Promise<Uint8Array> => {
  const response = await fetch("/mathrank_logo.png");
  if (!response.ok) {
    throw new Error("MathRank CI 이미지를 불러오지 못했습니다.");
  }
  return new Uint8Array(await response.arrayBuffer());
};

export const renderTitleImage = async (title: string): Promise<Uint8Array> => {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 160;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("시험지 제목 이미지를 만들 수 없습니다.");
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#111827";
  context.font = "700 72px Pretendard, Apple SD Gothic Neo, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(title.trim(), canvas.width / 2, canvas.height / 2, 1160);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png")
  );
  if (!blob) throw new Error("시험지 제목 이미지를 만들 수 없습니다.");
  return new Uint8Array(await blob.arrayBuffer());
};
