import { AxiosError } from "axios";
import instance from "../../../shared/apis/instance";
import type {
  PostResourceType,
  ResourceDeatiledType,
  ResourceItemType,
  ResourceQueryType,
  ResourceServerItemType,
  ResourcesResponsePagination,
} from "../types/resource";
import { mapContentTypeToResourceType } from "../utils/mapContentTypeToResourceType";

export const postResource = async (postData: PostResourceType) => {
  try {
    if (postData.resourceType == "testPaper") {
      const response = await instance.post(`/v1/content`, {
        title: postData.title,
        text: postData.text,
        contentType: "WORKBOOK",
        files: postData.file,
        price: postData.price,
        videoLinks: [],
      });

      return response.data;
    }
    if (postData.resourceType == "schoolPaper") {
      const response = await instance.post(`/v1/content`, {
        title: postData.title,
        text: postData.text,
        contentType: "NAESIN_WORKBOOK",
        files: postData.file,
        price: postData.price,
        videoLinks: [],
      });

      return response.data;
    }

    if (postData.resourceType === "video") {
      const response = await instance.post(`/v1/content`, {
        title: postData.title,
        text: postData.text,
        contentType: "VIDEO",
        files: [],
        price: postData.price,
        videoLinks: postData.videoLinks,
      });

      return response.data;
    }
  } catch (e) {
    console.log(e);
  }
};

export const getResourePagination = async (
  query: ResourceQueryType,
  page: number
): Promise<ResourcesResponsePagination> => {
  let contentType = "";

  switch (query.resourceType) {
    case "schoolPaper":
      contentType = "NAESIN_WORKBOOK";
      break;
    case "testPaper":
      contentType = "WORKBOOK";
      break;
    case "video":
      contentType = "VIDEO";
      break;
    default:
      contentType = "";
  }

  const { data } = await instance.get(
    `/v1/contents?title=${query.title}&contentType=${contentType}&page=${page}&pageSize=10`
  );

  // 서버 데이터를 프론트 타입으로 매핑
  const mappedItems: ResourceItemType[] = data.queryResults.map(
    (item: ResourceServerItemType) => ({
      resourceId: item.contentId,
      resourceType: mapContentTypeToResourceType(item.contentType), // 서버 contentType → 프론트 resourceType
      title: item.title,
      price: Number(item.price),
      createdAt: item.createdAt,
    })
  );

  return {
    ...data,
    queryResults: mappedItems,
  };
};

export const getDetailedResource = async (
  contentId: string
): Promise<ResourceDeatiledType> => {
  const { data } = await instance.get(`/v1/content/${contentId}`);

  return {
    ...data,
    resourceId: data.contentId,
    resourceType: mapContentTypeToResourceType(data.contentType), // 서버 contentType → 프론트 resourceType
  };
};

export const modifyResource = async (
  id: string,
  postData: PostResourceType
) => {
  try {
    if (postData.resourceType == "testPaper") {
      const response = await instance.put(`/v1/content/${id}`, {
        title: postData.title,
        text: postData.text,
        contentType: "WORKBOOK",
        fileSources: postData.file,
        price: postData.price,
        videoLinks: [],
      });

      return response.data;
    }
    if (postData.resourceType == "schoolPaper") {
      const response = await instance.put(`/v1/content/${id}`, {
        title: postData.title,
        text: postData.text,
        contentType: "NAESIN_WORKBOOK",
        fileSources: postData.file,
        price: postData.price,
        videoLinks: [],
      });

      return response.data;
    }

    if (postData.resourceType === "video") {
      const response = await instance.put(`/v1/content/${id}`, {
        title: postData.title,
        text: postData.text,
        contentType: "VIDEO",
        fileSources: [],
        price: postData.price,
        videoLinks: postData.videoLinks,
      });

      return response.data;
    }
  } catch (e) {
    if (e instanceof AxiosError) {
      throw e.message;
    }
    throw e;
  }
};
