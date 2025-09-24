import { AxiosError } from "axios";
import instance from "./instance";

export const uploadImageToServer = async (file: File): Promise<string> => {
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
