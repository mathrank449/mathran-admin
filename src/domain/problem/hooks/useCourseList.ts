// hooks/useCourseList.ts
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCourse } from "../apis/course";
import type { CourseType } from "../types/problem";

export function useCourseList(coursePath: string = "") {
  const [list, setList] = useState<CourseType[]>([]);

  const { data } = useQuery({
    queryKey: ["v1/problem/course", coursePath],
    queryFn: () => getCourse(coursePath),
    enabled: !!coursePath, // 빈 값일 경우 query 실행 방지
  });

  useEffect(() => {
    if (data) setList(data);
  }, [data]);

  return { list };
}
