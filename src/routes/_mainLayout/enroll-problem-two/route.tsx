import { createFileRoute } from "@tanstack/react-router";
import EnrollProblemPageTwo from "../../../domain/problem/enrollProblem/components/EnrollProblemPageTwo";
import { verifyAuth } from "../../../domain/user/utils/authGuard";

export const Route = createFileRoute("/_mainLayout/enroll-problem-two")({
  beforeLoad: async () => {
    await verifyAuth({ timeoutMs: 3000 });
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <EnrollProblemPageTwo />;
}
