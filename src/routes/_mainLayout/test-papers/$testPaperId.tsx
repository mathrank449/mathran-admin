import { createFileRoute } from "@tanstack/react-router";
import TestPaperDetailedPage from "../../../domain/testPaper/components/TestPaperDetailedPage";

export const Route = createFileRoute("/_mainLayout/test-papers/$testPaperId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { testPaperId } = Route.useParams();
  return <TestPaperDetailedPage testPaperId={testPaperId} />;
}
