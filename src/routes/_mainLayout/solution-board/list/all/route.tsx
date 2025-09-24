import { createFileRoute } from "@tanstack/react-router";
import SolutionBoardPage from "../../../../../domain/solutionBoard/components/SolutionBoardPage";

export const Route = createFileRoute("/_mainLayout/solution-board/list/all")({
  component: RouteComponent,
});

function RouteComponent() {
  return <SolutionBoardPage />;
}
