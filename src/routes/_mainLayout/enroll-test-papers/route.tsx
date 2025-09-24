import { createFileRoute } from "@tanstack/react-router";
import EnrollTestPapersPage from "../../../domain/testPaper/enrollTestPapers/components/EnrollTestPapersPage";
import { verifyAuth } from "../../../domain/user/utils/authGuard";

export const Route = createFileRoute("/_mainLayout/enroll-test-papers")({
  beforeLoad: async () => {
    await verifyAuth({ timeoutMs: 3000 });
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <EnrollTestPapersPage />;
}
