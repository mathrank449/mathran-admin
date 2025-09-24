import { createFileRoute } from "@tanstack/react-router";
import QuestionDetailPage from "../../../domain/solutionBoard/questions/components/QuestionDetailPage";
import { verifyAuth } from "../../../domain/user/utils/authGuard";

export const Route = createFileRoute("/_mainLayout/questions/$questionId")({
  beforeLoad: async () => {
    await verifyAuth({ timeoutMs: 3000 });
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { questionId } = Route.useParams();
  return <QuestionDetailPage questionId={questionId} />;
}
