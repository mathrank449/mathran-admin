import { createFileRoute } from "@tanstack/react-router";
import SolutionContestBoardPage from "../../../../../../domain/solutionBoard/components/SolutionContestBoardPage";

export const Route = createFileRoute(
  "/_mainLayout/solution-board/question/contest/$contestId"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { contestId } = Route.useParams();
  return <SolutionContestBoardPage contestId={contestId} />;
}
