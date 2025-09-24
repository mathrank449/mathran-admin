import { createFileRoute } from "@tanstack/react-router";
import SolutionContestBoardPage from "../../../../../../domain/solutionBoard/components/SolutionContestBoardPage";
import { verifyAuth } from "../../../../../../domain/user/utils/authGuard";

export const Route = createFileRoute(
  "/_mainLayout/solution-board/question/contest/$contestId"
)({
  beforeLoad: async () => {
    await verifyAuth({ timeoutMs: 3000 });
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { contestId } = Route.useParams();
  return <SolutionContestBoardPage contestId={contestId} />;
}
