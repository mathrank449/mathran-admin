import { createFileRoute } from "@tanstack/react-router";
import ProblemDetailPage from "../../../domain/problem/problem/components/ProblemDetailPage";
import { verifyAuth } from "../../../domain/user/utils/authGuard";

export const Route = createFileRoute("/_mainLayout/problems/$problemId")({
  beforeLoad: async () => {
    await verifyAuth({ timeoutMs: 3000 });
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { problemId } = Route.useParams();

  return <ProblemDetailPage problemId={problemId} />;
}
