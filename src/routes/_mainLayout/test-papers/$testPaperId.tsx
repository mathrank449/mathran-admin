import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_mainLayout/test-papers/$testPaperId")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_mainLayout/test-papers/$testPaperId"!</div>;
}
