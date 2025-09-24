import { createFileRoute } from "@tanstack/react-router";
import QuestionDetailPage from "../../../domain/solutionBoard/questions/components/QuestionDetailPage";

export const Route = createFileRoute("/_mainLayout/questions/$questionId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { questionId } = Route.useParams();
  return <QuestionDetailPage questionId={questionId} />;
}
