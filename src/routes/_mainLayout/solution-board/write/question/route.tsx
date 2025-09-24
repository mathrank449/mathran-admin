import { createFileRoute } from "@tanstack/react-router";
import WritingQuestionPage from "../../../../../domain/solutionBoard/write/components/WritingQuestionPage";

export const Route = createFileRoute(
  "/_mainLayout/solution-board/write/question"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <WritingQuestionPage />;
}
