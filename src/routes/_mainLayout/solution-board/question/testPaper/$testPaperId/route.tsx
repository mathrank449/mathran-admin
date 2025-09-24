import { createFileRoute } from "@tanstack/react-router";
import SolutionTestPaperBoardPage from "../../../../../../domain/solutionBoard/components/SolutionTestPaperBoardPage";

export const Route = createFileRoute(
  "/_mainLayout/solution-board/question/testPaper/$testPaperId"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { testPaperId } = Route.useParams();
  return <SolutionTestPaperBoardPage testPaperId={testPaperId} />;
}
