import { createFileRoute } from "@tanstack/react-router";
import EnrollContestPage from "../../../domain/contest/enrollContest/components/EnrollContestPage";
import { verifyAuth } from "../../../domain/user/utils/authGuard";

export const Route = createFileRoute("/_mainLayout/enroll-contests")({
  beforeLoad: async () => {
    await verifyAuth({ timeoutMs: 3000 });
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <EnrollContestPage />;
}
