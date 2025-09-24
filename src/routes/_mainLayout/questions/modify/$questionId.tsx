import { createFileRoute } from "@tanstack/react-router";
import QuestionModifyPage from "../../../../domain/solutionBoard/questions/components/QuestionModifyPage";

export const Route = createFileRoute(
  "/_mainLayout/questions/modify/$questionId"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { questionId } = Route.useParams();
  return <QuestionModifyPage questionId={questionId} />;
}
