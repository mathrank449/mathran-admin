import { createFileRoute } from "@tanstack/react-router";
import WriteResourcePage from "../../../../domain/resource/components/WriteResourcePage";

export const Route = createFileRoute("/_mainLayout/resource/write")({
  component: RouteComponent,
});

function RouteComponent() {
  return <WriteResourcePage />;
}
