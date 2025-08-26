import type { CourseType } from "./problem";

export type SelectedUnits = {
  large?: CourseType;
  middle?: CourseType;
  small?: CourseType;
};

export type SelectedUnitsGrade = {
  grade?: CourseType;
  large?: CourseType;
  middle?: CourseType;
  small?: CourseType;
};
