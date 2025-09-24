import { createFileRoute } from "@tanstack/react-router";
import SolutionProblemBoardPage from "../../../../../../domain/solutionBoard/components/SolutionProblemBoardPage";
import { verifyAuth } from "../../../../../../domain/user/utils/authGuard";

export const Route = createFileRoute(
  "/_mainLayout/solution-board/question/problem/$problemId"
)({
  beforeLoad: async () => {
    await verifyAuth({ timeoutMs: 3000 });
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { problemId } = Route.useParams();
  return <SolutionProblemBoardPage problemId={problemId} />;
}
