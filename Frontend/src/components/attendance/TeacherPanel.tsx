import { useState } from "react";
import { Plus, X, Calendar, Copy, Check } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import type { ClassSessionDTO } from "@/lib/api";

/** UI-friendly alias. Backend shape lives in @/lib/api/types. */
export type ClassSession = {
  id: string;
  name: string;
  createdAt: number;
  token: string;
  qrPayload: string;
};

export function fromDTO(dto: ClassSessionDTO): ClassSession {
  return {
    id: dto.id,
    name: dto.name,
    createdAt: new Date(dto.started_at).getTime(),
    token: dto.token,
    qrPayload: dto.qr_payload,
  };
}

export function TeacherPanel({
  classes,
  onCreate,
  onDelete,
}: {
  classes: ClassSession[];
  onCreate: (name: string) => Promise<ClassSession>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [active, setActive] = useState<ClassSession | null>(null);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!name.trim() || submitting) return;
    setSubmitting(true);
    try {
      const cls = await onCreate(name.trim());
      setActive(cls);
      setName("");
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    const date = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const time = d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${date} at ${time}`;
  };

  const qrValue = active?.qrPayload ?? "";

  const copy = async () => {
    if (!qrValue) return;
    await navigator.clipboard.writeText(qrValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Create Class Session card */}
      <div className="rounded-2xl bg-card shadow-sm border border-border/60 px-6 py-6 sm:px-8 sm:py-7">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            Create Class Session
          </h2>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
          >
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? "Cancel" : "New Class"}
          </button>
        </div>

        {showForm && (
          <div className="mt-5 rounded-xl border border-border bg-secondary/40 p-4">
            <label className="text-sm font-medium text-foreground">Class name</label>
            <div className="mt-2 flex flex-col sm:flex-row gap-2">
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder="e.g. Math 101"
                className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button
                onClick={handleCreate}
                disabled={submitting}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
              >
                {submitting ? "Creating…" : "Create"}
              </button>
            </div>
          </div>
        )}

        <h3 className="mt-6 text-sm font-bold text-foreground">Recent Classes</h3>

        {classes.length === 0 ? (
          <p className="mt-6 mb-2 text-center text-sm text-muted-foreground">
            No classes created yet
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {classes.map((c) => {
              const isActive = active?.id === c.id;
              return (
                <li
                  key={c.id}
                  onClick={() => setActive(c)}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 cursor-pointer transition-colors ${
                    isActive
                      ? "border-primary bg-accent/60"
                      : "border-border bg-card hover:bg-secondary/40"
                  }`}
                >
                  <div>
                    <p className="text-sm font-bold text-foreground">{c.name}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(c.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      await onDelete(c.id);
                      if (active?.id === c.id) setActive(null);
                    }}
                    className="text-destructive hover:text-destructive/80 p-1 rounded-md transition-colors"
                    aria-label="Remove class"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* QR Code for Attendance card */}
      {active && (
        <div className="rounded-2xl bg-card shadow-sm border border-border/60 px-6 py-6 sm:px-8 sm:py-7">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            QR Code for Attendance
          </h2>

          <div className="mt-6 flex flex-col items-center">
            <div className="rounded-2xl border-2 border-primary bg-card p-5">
              <QRCodeSVG
                value={qrValue}
                size={224}
                bgColor="#ffffff"
                fgColor="#000000"
                level="M"
              />
            </div>

            <p className="mt-5 text-base font-bold text-foreground">{active.name}</p>
            <p className="mt-1 text-xs text-primary/80">{formatDate(active.createdAt)}</p>
            <p className="mt-3 text-xs text-muted-foreground">
              Students should scan this code to mark attendance
            </p>
            <button
              onClick={copy}
              className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-primary hover:underline"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy join link"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
