import { createFileRoute } from "@tanstack/react-router";
import EnrollTestPapersPageThree from "../../../domain/problem/enrollTestPapers/components/EnrollTestPapersPageThree";

export const Route = createFileRoute("/_mainLayout/enroll-test-papers-three")({
  component: RouteComponent,
});

function RouteComponent() {
  return <EnrollTestPapersPageThree />;
}
