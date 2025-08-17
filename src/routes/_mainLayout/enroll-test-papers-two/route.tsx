import { createFileRoute } from "@tanstack/react-router";
import EnrollTestPapersPageTwo from "../../../domain/problem/enrollTestPapers/components/EnrollTestPapersPageTwo";

export const Route = createFileRoute("/_mainLayout/enroll-test-papers-two")({
  component: RouteComponent,
});

function RouteComponent() {
  return <EnrollTestPapersPageTwo />;
}
