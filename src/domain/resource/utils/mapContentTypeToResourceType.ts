import type { ServerResourceType, ResourceType } from "../types/resource";

export const mapContentTypeToResourceType = (
  contentType: ServerResourceType
): ResourceType => {
  switch (contentType) {
    case "VIDEO":
      return "video";
    case "WORKBOOK":
      return "testPaper";
    case "NAESIN_WORKBOOK":
      return "schoolPaper";
  }
};
