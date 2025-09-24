import { createFileRoute } from "@tanstack/react-router";
import SolutionNoticeBoardPage from "../../../../../domain/solutionBoard/components/SolutionNoticeBoardPage";

export const Route = createFileRoute("/_mainLayout/solution-board/list/notice")(
  {
    component: RouteComponent,
  }
);

function RouteComponent() {
  return <SolutionNoticeBoardPage />;
}
