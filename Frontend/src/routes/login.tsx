import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { AuthShell, Field, inputClass, primaryBtnClass } from "@/components/auth/AuthShell";
import { useAuth } from "@/lib/auth-context";
import { isAuthenticated } from "@/lib/api";
import type { ApiError } from "@/lib/api";

export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    if (isAuthenticated()) throw redirect({ to: "/dashboard" });
  },
  head: () => ({ meta: [{ title: "Sign in — Attendance" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError((err as ApiError)?.message ?? "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your attendance account"
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Email">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputClass}
          />
        </Field>
        <Field label="Password">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className={inputClass}
          />
        </Field>

        {error && (
          <p className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <button type="submit" disabled={submitting} className={primaryBtnClass}>
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthShell>
  );
}
