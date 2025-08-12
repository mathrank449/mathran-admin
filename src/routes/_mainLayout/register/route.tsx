import { createFileRoute } from "@tanstack/react-router";
import RegisterPage from "../../../domain/user/components/RegisterPage";

export const Route = createFileRoute("/_mainLayout/register")({
  component: RouteComponent,
});

function RouteComponent() {
  return <RegisterPage />;
}
