import { AxiosError } from "axios";
import instance from "./instance";
import type { FileRealInfo } from "../type/file";

export const uploadFileToServer = async (file: File): Promise<string> => {
  try {
    const formdata = new FormData();
    formdata.append("image", file);
    const res = await instance.post<{ imageURI: string }>(
      "/v1/image",
      formdata,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return res.data.imageURI; // ← 반드시 return!
  } catch (e) {
    if (e instanceof AxiosError) {
      throw e.message;
    }
    throw e;
  }
};

export const downloadFile = async (file: FileRealInfo) => {
  try {
    const response = await instance.get(
      `/v1/file/download?fileSource=${encodeURIComponent(
        file.fileSource
      )}&fileRealName=${encodeURIComponent(file.fileRealName)}`,
      {
        responseType: "blob", // 🔥 파일을 blob(이진 데이터)로 받기
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    // 🔥 Blob 데이터를 URL로 변환
    const blobUrl = window.URL.createObjectURL(new Blob([response.data]));

    // 🔥 a 태그를 만들어서 다운로드 트리거
    const link = document.createElement("a");
    link.href = blobUrl;
    link.setAttribute("download", file.fileRealName); // 다운로드될 파일 이름
    document.body.appendChild(link);
    link.click();

    // 메모리 정리
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("파일 다운로드 실패:", error);
    alert("파일 다운로드 중 오류가 발생했습니다.");
  }
};
