import { createFileRoute } from "@tanstack/react-router";
import WritingQuestionPage from "../../../../../domain/solutionBoard/write/components/WritingQuestionPage";
import { verifyAuth } from "../../../../../domain/user/utils/authGuard";

export const Route = createFileRoute(
  "/_mainLayout/solution-board/write/question"
)({
  beforeLoad: async () => {
    await verifyAuth({ timeoutMs: 3000 });
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <WritingQuestionPage />;
}
