import { createFileRoute } from "@tanstack/react-router";
import SolutionProblemBoardPage from "../../../../../domain/solutionBoard/components/SolutionProblemBoardPage";

export const Route = createFileRoute(
  "/_mainLayout/solution-board/question/problem/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <SolutionProblemBoardPage />;
}
