import { createFileRoute } from "@tanstack/react-router";
import EnrollProblemPageThree from "../../../domain/problem/enrollProblem/components/EnrollProblemPageThree";
export const Route = createFileRoute("/_mainLayout/enroll-problem-three")({
  component: RouteComponent,
});

function RouteComponent() {
  return <EnrollProblemPageThree />;
}
