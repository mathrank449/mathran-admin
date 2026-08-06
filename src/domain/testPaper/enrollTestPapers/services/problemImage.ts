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

export const downloadProblemImage = async (
  imageSource: string
): Promise<Uint8Array> => {
  const response = await instance.get<ArrayBuffer>("/v1/image", {
    params: { imageSource },
    responseType: "arraybuffer",
  });
  return new Uint8Array(response.data);
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
