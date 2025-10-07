import { createFileRoute } from "@tanstack/react-router";
import ResourcePage from "../../../domain/resource/components/ResourcePage";

export const Route = createFileRoute("/_mainLayout/resource/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ResourcePage />;
}
