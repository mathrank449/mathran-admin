import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Header } from "../../shared/components/Header";

export const Route = createFileRoute("/_mainLayout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="bg-rbBg min-w-[1680px] relative">
          <Outlet />
        </main>
      </div>
    </>
  );
}
