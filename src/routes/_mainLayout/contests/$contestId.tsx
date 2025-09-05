import { createFileRoute } from "@tanstack/react-router";
import ContestDetailedPage from "../../../domain/contest/components/ContestDetailedPage";

export const Route = createFileRoute("/_mainLayout/contests/$contestId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { contestId } = Route.useParams();
  return <ContestDetailedPage contestId={contestId} />;
}
