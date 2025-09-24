import { createFileRoute } from "@tanstack/react-router";
import SolutionFreeBoardPage from "../../../../../domain/solutionBoard/components/SolutionFreeBoardPage";

export const Route = createFileRoute("/_mainLayout/solution-board/list/free")({
  component: RouteComponent,
});

function RouteComponent() {
  return <SolutionFreeBoardPage />;
}
