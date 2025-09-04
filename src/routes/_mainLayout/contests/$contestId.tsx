import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_mainLayout/contests/$contestId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { contestId } = Route.useParams();
  return <div>Hello "/_mainLayout/contests/$contestId"!</div>;
}
