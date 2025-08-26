import { createFileRoute } from "@tanstack/react-router";
import PopularProblemListPage from "../../../../domain/problem/problem/components/PopularProblemListPage";

export const Route = createFileRoute("/_mainLayout/problems/popular")({
  component: RouteComponent,
});

function RouteComponent() {
  return <PopularProblemListPage />;
}
