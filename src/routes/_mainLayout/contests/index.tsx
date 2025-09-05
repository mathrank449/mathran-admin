import { createFileRoute } from "@tanstack/react-router";
import ContestListPage from "../../../domain/contest/components/ContestListPage";

export const Route = createFileRoute("/_mainLayout/contests/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ContestListPage />;
}
