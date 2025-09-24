import { createFileRoute } from "@tanstack/react-router";
import EnrollProblemPage from "../../../domain/problem/enrollProblem/components/EnrollProblemPage";
import { verifyAuth } from "../../../domain/user/utils/authGuard";

export const Route = createFileRoute("/_mainLayout/enroll-problem")({
  beforeLoad: async () => {
    await verifyAuth({ timeoutMs: 3000 });
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <EnrollProblemPage />;
}
