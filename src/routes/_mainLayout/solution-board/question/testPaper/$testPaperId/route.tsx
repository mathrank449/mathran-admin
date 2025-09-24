import { createFileRoute } from "@tanstack/react-router";
import SolutionTestPaperBoardPage from "../../../../../../domain/solutionBoard/components/SolutionTestPaperBoardPage";
import { verifyAuth } from "../../../../../../domain/user/utils/authGuard";

export const Route = createFileRoute(
  "/_mainLayout/solution-board/question/testPaper/$testPaperId"
)({
  beforeLoad: async () => {
    await verifyAuth({ timeoutMs: 3000 });
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { testPaperId } = Route.useParams();
  return <SolutionTestPaperBoardPage testPaperId={testPaperId} />;
}
