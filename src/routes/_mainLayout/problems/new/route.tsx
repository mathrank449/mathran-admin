import { createFileRoute } from "@tanstack/react-router";
import NewProblemListPage from "../../../../domain/problem/problem/components/NewProblemListPage";

export const Route = createFileRoute("/_mainLayout/problems/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return <NewProblemListPage />;
}
