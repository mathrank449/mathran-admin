import { createFileRoute } from "@tanstack/react-router";
import ContestDetailedPage from "../../../domain/contest/components/ContestDetailedPage";
import { verifyAuth } from "../../../domain/user/utils/authGuard";

export const Route = createFileRoute("/_mainLayout/contests/$contestId")({
  beforeLoad: async () => {
    await verifyAuth({ timeoutMs: 3000 });
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { contestId } = Route.useParams();
  return <ContestDetailedPage contestId={contestId} />;
}
