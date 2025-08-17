import instance from "../../../shared/apis/instance";
import type { CourseType } from "../types/problem";

export const getCourse = async (path: string = ""): Promise<CourseType[]> => {
  try {
    const response = await instance.get(`/v1/problem/course?path=${path}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching course:", error);
    throw error;
  }
};
