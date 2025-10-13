import { createFileRoute } from "@tanstack/react-router";
import ResourceModificationPage from "../../../../../domain/resource/components/ResourceModificationPage";

export const Route = createFileRoute("/_mainLayout/resource/$id/modify")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  return <ResourceModificationPage id={id} />;
}
