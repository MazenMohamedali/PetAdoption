import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { AuthShell, Field, inputClass, primaryBtnClass } from "@/components/auth/AuthShell";
import { useAuth } from "@/lib/auth-context";
import { isAuthenticated } from "@/lib/api";
import type { ApiError, UserRole } from "@/lib/api";

export const Route = createFileRoute("/register")({
  beforeLoad: () => {
    if (isAuthenticated()) throw redirect({ to: "/dashboard" });
  },
  head: () => ({ meta: [{ title: "Create account — Attendance" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState<string>("");
  const [role, setRole] = useState<UserRole>("STUDENT");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        age: Number(age),
        role,
      });
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError((err as ApiError)?.message ?? "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Sign up as a student or lecturer"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Full name">
          <input
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jane Doe"
            className={inputClass}
          />
        </Field>
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
        <div className="grid grid-cols-2 gap-3">
          <Field label="Password">
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClass}
            />
          </Field>
          <Field label="Age">
            <input
              type="number"
              required
              min={1}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="20"
              className={inputClass}
            />
          </Field>
        </div>

        <div>
          <span className="text-sm font-medium text-foreground">I am a</span>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(["STUDENT", "LECTURER"] as const).map((r) => {
              const active = role === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`rounded-lg border px-3 py-2.5 text-sm font-medium cursor-pointer transition-colors ${
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:bg-secondary"
                  }`}
                >
                  {r === "STUDENT" ? "Student" : "Lecturer"}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <p className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <button type="submit" disabled={submitting} className={primaryBtnClass}>
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}
