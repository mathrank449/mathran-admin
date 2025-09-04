import { createFileRoute } from "@tanstack/react-router";
import EnrollContestPage from "../../../domain/contest/enrollContest/components/EnrollContestPage";

export const Route = createFileRoute("/_mainLayout/enroll-contests")({
  component: RouteComponent,
});

function RouteComponent() {
  return <EnrollContestPage />;
}
