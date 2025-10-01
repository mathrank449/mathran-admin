import { createFileRoute } from "@tanstack/react-router";
import ProblemListByPastProblemPage from "../../../../domain/problem/problem/components/ProblemListByPastProblemPage";

export const Route = createFileRoute("/_mainLayout/problems/high-school-3")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ProblemListByPastProblemPage defaultPastProblem="HIGH_SCHOOL_3" />;
}
