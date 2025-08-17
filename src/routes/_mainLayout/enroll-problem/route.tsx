import { createFileRoute } from "@tanstack/react-router";
import EnrollProblemPage from "../../../domain/problem/enrollProblem/components/EnrollProblemPage";

export const Route = createFileRoute("/_mainLayout/enroll-problem")({
  component: RouteComponent,
});

function RouteComponent() {
  return <EnrollProblemPage />;
}
