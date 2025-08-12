import { createFileRoute } from "@tanstack/react-router";
import { Header } from "../shared/components/Header";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="bg-rbBg flex-1 flex items-center justify-center">
        메인페이지
      </main>
    </div>
  );
}
