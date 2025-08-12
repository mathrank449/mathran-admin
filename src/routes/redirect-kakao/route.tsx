import { createFileRoute, useSearch } from "@tanstack/react-router";
import RedirectPage from "../../domain/user/components/RedirectPage";

type SearchParams = {
  code?: string;
  state?: string;
  error?: Error;
};

export const Route = createFileRoute("/redirect-kakao")({
  component: RouteComponent,
  validateSearch: (search): SearchParams => {
    return {
      code: search.code as string,
      state: search.state as string,
      error: search.error as Error,
    };
  },
});

function RouteComponent() {
  const { code, error } = useSearch({ from: "/redirect-kakao" });

  return <RedirectPage code={code} error={error} />;
}
