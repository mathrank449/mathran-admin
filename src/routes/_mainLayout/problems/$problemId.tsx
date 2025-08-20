import { createFileRoute } from "@tanstack/react-router";
import ProblemDetailPage from "../../../domain/problem/problem/components/ProblemDetailPage";

export const Route = createFileRoute("/_mainLayout/problems/$problemId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { problemId } = Route.useParams();

  return <ProblemDetailPage problemId={problemId} />;
}
