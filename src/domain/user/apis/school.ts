import instance from "../../../apis/instance";

export const getSchoolList = async (
  schoolName: string = "ac",
  pageIndex: number = 0
) => {
  try {
    const response = await instance.get(
      `api/v1/schools?schoolName=${schoolName}&pageIndex=${pageIndex}&pageSize=${5}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching course:", error);
    throw error;
  }
};
