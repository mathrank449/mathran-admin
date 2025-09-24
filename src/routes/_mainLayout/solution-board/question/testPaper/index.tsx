import { createFileRoute } from "@tanstack/react-router";
import SolutionTestPaperBoardPage from "../../../../../domain/solutionBoard/components/SolutionTestPaperBoardPage";

export const Route = createFileRoute(
  "/_mainLayout/solution-board/question/testPaper/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <SolutionTestPaperBoardPage />;
}
