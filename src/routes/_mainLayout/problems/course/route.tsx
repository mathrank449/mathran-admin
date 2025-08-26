import { createFileRoute } from "@tanstack/react-router";
import CourseProblemList from "../../../../domain/problem/problem/components/CourseProblemList";

export const Route = createFileRoute("/_mainLayout/problems/course")({
  component: RouteComponent,
});

function RouteComponent() {
  return <CourseProblemList />;
}
