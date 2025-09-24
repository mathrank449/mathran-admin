import { createFileRoute } from "@tanstack/react-router";
import SolutionContestBoardPage from "../../../../../domain/solutionBoard/components/SolutionContestBoardPage";

export const Route = createFileRoute(
  "/_mainLayout/solution-board/question/contest/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <SolutionContestBoardPage />;
}
