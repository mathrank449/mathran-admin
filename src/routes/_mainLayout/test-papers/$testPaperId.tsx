import { createFileRoute } from "@tanstack/react-router";
import TestPaperDetailedPage from "../../../domain/testPaper/components/TestPaperDetailedPage";
import { verifyAuth } from "../../../domain/user/utils/authGuard";

export const Route = createFileRoute("/_mainLayout/test-papers/$testPaperId")({
  beforeLoad: async () => {
    await verifyAuth({ timeoutMs: 3000 });
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { testPaperId } = Route.useParams();
  return <TestPaperDetailedPage testPaperId={testPaperId} />;
}
