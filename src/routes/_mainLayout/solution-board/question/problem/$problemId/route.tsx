import { createFileRoute } from "@tanstack/react-router";
import SolutionProblemBoardPage from "../../../../../../domain/solutionBoard/components/SolutionProblemBoardPage";

export const Route = createFileRoute(
  "/_mainLayout/solution-board/question/problem/$problemId"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { problemId } = Route.useParams();
  return <SolutionProblemBoardPage problemId={problemId} />;
}
