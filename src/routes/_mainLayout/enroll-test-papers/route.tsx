import { createFileRoute } from "@tanstack/react-router";
import EnrollTestPapersPage from "../../../domain/testPaper/enrollTestPapers/components/EnrollTestPapersPage";

export const Route = createFileRoute("/_mainLayout/enroll-test-papers")({
  component: RouteComponent,
});

function RouteComponent() {
  return <EnrollTestPapersPage />;
}
