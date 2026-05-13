import { useEffect, useState } from "react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { LogOut, QrCode, FileText, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  TeacherPanel,
  fromDTO,
  type ClassSession,
} from "@/components/attendance/TeacherPanel";
import {
  StudentPanel,
  fromAttendanceDTO,
  type AttendanceRecord,
} from "@/components/attendance/StudentPanel";
import { RecordsPanel } from "@/components/attendance/RecordsPanel";
import { useAuth } from "@/lib/auth-context";
import * as api from "@/lib/api";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
    if (!api.isAuthenticated()) throw redirect({ to: "/login" });
  },
  head: () => ({
    meta: [
      { title: "Dashboard — Attendance" },
      {
        name: "description",
        content: "Manage classes and attendance with QR codes.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null; // beforeLoad guards this; keeps TS happy

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <main className="min-h-screen bg-background py-6 sm:py-10 px-4">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <header className="rounded-2xl bg-card shadow-sm border border-border/40 px-6 py-5 sm:px-8 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-foreground">
              Welcome, {user.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Signed in as {user.role === "LECTURER" ? "Lecturer" : "Student"} · {user.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </header>

        {user.role === "LECTURER" ? <LecturerView /> : <StudentView />}
      </div>
    </main>
  );
}

/* ---------------- Lecturer ---------------- */

type LecturerTab = "classes" | "records";

function LecturerView() {
  const [tab, setTab] = useState<LecturerTab>("classes");
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  // Load lecturer's courses on mount.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await api.listMyCourses();
        if (!cancelled) setClasses(list.map(fromDTO));
      } catch {
        /* unauthenticated or backend down */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Refresh attendance records when entering the records tab or when
  // the class list changes (new/deactivated lecture).
  useEffect(() => {
    if (tab !== "records" || classes.length === 0) return;
    let cancelled = false;
    (async () => {
      try {
        const all = await Promise.all(
          classes.map((c) => api.getCourseAttendance(Number(c.id))),
        );
        if (cancelled) return;
        setRecords(all.flat().map(fromAttendanceDTO));
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [tab, classes]);

  const createClass = async (name: string): Promise<ClassSession> => {
    const dto = await api.createCourse({ name, description: "" });
    const cls = fromDTO(dto);
    // Prepend so the QR view immediately reflects the latest backend qrCode.
    setClasses((c) => [cls, ...c]);
    return cls;
  };

  const deleteClass = async (id: string): Promise<void> => {
    await api.deactivateCourse(Number(id));
    setClasses((c) => c.filter((x) => x.id !== id));
  };

  return (
    <div className="space-y-6">
      <RoleTabs
        tabs={[
          { key: "classes", label: "Classes", Icon: QrCode },
          { key: "records", label: "Records", Icon: FileText },
        ]}
        active={tab}
        onChange={setTab}
      />
      {tab === "classes" ? (
        <TeacherPanel classes={classes} onCreate={createClass} onDelete={deleteClass} />
      ) : (
        <RecordsPanel classes={classes} records={records} />
      )}
    </div>
  );
}

/* ---------------- Student ---------------- */

function StudentView() {
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await api.listActiveCourses();
        if (!cancelled) setClasses(list.map(fromDTO));
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const scanQr = async (qrPayload: string): Promise<void> => {
    const record = await api.scanQr({ qrCode: qrPayload });
    setRecords((r) => [fromAttendanceDTO(record), ...r]);
  };

  return (
    <div className="space-y-6">
      <RoleTabs
        tabs={[{ key: "scan", label: "Scan", Icon: UserRound }]}
        active="scan"
        onChange={() => {}}
      />
      <StudentPanel classes={classes} onScan={scanQr} />
      {records.length > 0 && (
        <div className="rounded-2xl bg-card shadow-sm border border-border/40 px-6 py-6 sm:px-8 sm:py-7">
          <h2 className="text-lg sm:text-xl font-bold text-foreground">My recent scans</h2>
          <ul className="mt-4 space-y-2">
            {records.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-sm"
              >
                <span className="font-medium text-foreground">{r.className}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(r.timestamp).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ---------------- Tabs ---------------- */

function RoleTabs<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: { key: T; label: string; Icon: React.ComponentType<{ className?: string }> }[];
  active: T;
  onChange: (k: T) => void;
}) {
  return (
    <div className="rounded-2xl bg-card shadow-sm border border-border/40 px-4 py-4 sm:px-6">
      <div className={`grid gap-2 sm:gap-3`} style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}>
        {tabs.map(({ key, label, Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-secondary-foreground hover:bg-accent",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
