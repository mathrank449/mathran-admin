import { createFileRoute } from "@tanstack/react-router";
import ProblemListByLocationPage from "../../../../domain/problem/problem/components/ProblemListByLocationPage";

export const Route = createFileRoute("/_mainLayout/problems/busan")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ProblemListByLocationPage defaultLocation="busan" />;
}
