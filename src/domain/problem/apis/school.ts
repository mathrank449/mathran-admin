import instance from "../../../shared/apis/instance";
import type { School } from "../types/school";

type Location = {
  cityName: string;
  district: string;
};

export const getSchoolsByLocation = async (
  location: Location
): Promise<School[]> => {
  const { data } = await instance.get(
    `/v1/schools/by-address?cityName=${location.cityName}&district=${location.district}`
  );
  return data;
};
