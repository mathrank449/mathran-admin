import { createFileRoute } from "@tanstack/react-router";
import TestPapersListPage from "../../../domain/testPaper/components/TestPapersListPage";

export const Route = createFileRoute("/_mainLayout/test-papers/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <TestPapersListPage />;
}
