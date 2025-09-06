import { createFileRoute } from "@tanstack/react-router";
import RankingListPage from "../../../domain/rank/components/RankingListPage";

export const Route = createFileRoute("/_mainLayout/rankings")({
  component: RouteComponent,
});

function RouteComponent() {
  return <RankingListPage />;
}
