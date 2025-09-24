import { createFileRoute } from "@tanstack/react-router";
import EnrollProblemPageThree from "../../../domain/problem/enrollProblem/components/EnrollProblemPageThree";
import { verifyAuth } from "../../../domain/user/utils/authGuard";
export const Route = createFileRoute("/_mainLayout/enroll-problem-three")({
  beforeLoad: async () => {
    await verifyAuth({ timeoutMs: 3000 });
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <EnrollProblemPageThree />;
}
