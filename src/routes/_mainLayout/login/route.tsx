import { createFileRoute } from "@tanstack/react-router";
import LoginPage from "../../../domain/user/components/LoginPage";

export const Route = createFileRoute("/_mainLayout/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return <LoginPage />;
}
