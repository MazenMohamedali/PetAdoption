import { createFileRoute, redirect } from "@tanstack/react-router";
import * as api from "@/lib/api";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: api.isAuthenticated() ? "/dashboard" : "/login" });
  },
  component: () => null,
});
