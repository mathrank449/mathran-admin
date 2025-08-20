import { createFileRoute } from "@tanstack/react-router";
import ProblemListPage from "../../../domain/problem/problem/components/ProblemListPage";

export const Route = createFileRoute("/_mainLayout/problems/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ProblemListPage />;
}
