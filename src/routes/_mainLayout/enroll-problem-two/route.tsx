import { createFileRoute } from "@tanstack/react-router";
import EnrollProblemPageTwo from "../../../domain/problem/enrollProblem/components/EnrollProblemPageTwo";

export const Route = createFileRoute("/_mainLayout/enroll-problem-two")({
  component: RouteComponent,
});

function RouteComponent() {
  return <EnrollProblemPageTwo />;
}
