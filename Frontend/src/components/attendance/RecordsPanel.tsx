import { useMemo, useState } from "react";
import { Calendar, Users, UserCircle2 } from "lucide-react";
import type { ClassSession } from "./TeacherPanel";
import type { AttendanceRecord } from "./StudentPanel";

export function RecordsPanel({
  classes,
  records,
}: {
  classes: ClassSession[];
  records: AttendanceRecord[];
}) {
  const [filter, setFilter] = useState<string>("all");

  const filtered = useMemo(
    () => (filter === "all" ? records : records.filter((r) => r.classId === filter)),
    [records, filter],
  );

  const uniqueStudents = new Set(filtered.map((r) => r.studentName.toLowerCase())).size;

  const formatClassDate = (ts: number) => {
    const d = new Date(ts);
    const date = d.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
    const time = d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return `${date} at ${time}`;
  };

  const countsByClass = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of records) map.set(r.classId, (map.get(r.classId) ?? 0) + 1);
    return map;
  }, [records]);

  return (
    <div className="space-y-6">
    <div className="rounded-2xl bg-card shadow-sm border border-border/40 px-6 py-6 sm:px-8 sm:py-7">
      <h2 className="text-lg sm:text-xl font-bold text-foreground">Attendance Records</h2>

      <div className="mt-5">
        <label className="text-sm text-muted-foreground">
          Filter by <span className="text-primary font-medium">Class</span>
        </label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
        >
          <option value="all">All Classes</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Stat
          icon={Calendar}
          label="Total Classes"
          value={classes.length}
          tone="bg-blue-50 text-blue-600 border-blue-100"
        />
        <Stat
          icon={Users}
          label="Total Records"
          value={filtered.length}
          tone="bg-emerald-50 text-emerald-600 border-emerald-100"
        />
        <Stat
          icon={UserCircle2}
          label="Unique Students"
          value={uniqueStudents}
          tone="bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 mb-6 flex flex-col items-center text-muted-foreground">
          <Users className="h-10 w-10 opacity-60" />
          <p className="mt-2 text-sm">No attendance records found</p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              <tr>
                <th className="px-4 py-2.5">Student</th>
                <th className="px-4 py-2.5">Class</th>
                <th className="px-4 py-2.5">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((r) => {
                const cls = classes.find((c) => c.id === r.classId);
                const classDate = cls
                  ? new Date(cls.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })
                  : null;
                return (
                  <tr key={r.id}>
                    <td className="px-4 py-2.5 font-medium text-foreground">{r.studentName}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {r.className}
                      {classDate ? ` - ${classDate}` : ""}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {new Date(r.timestamp).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>

    {classes.length > 0 && (
      <div className="rounded-2xl bg-card shadow-sm border border-border/40 px-6 py-6 sm:px-8 sm:py-7">
        <h2 className="text-lg sm:text-xl font-bold text-foreground">Class Summary</h2>
        <ul className="mt-4 space-y-3">
          {classes.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3"
            >
              <div>
                <p className="text-sm font-bold text-foreground">{c.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatClassDate(c.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-medium text-primary">
                <Users className="h-4 w-4" />
                {countsByClass.get(c.id) ?? 0}
              </div>
            </li>
          ))}
        </ul>
      </div>
    )}
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className={`rounded-xl border p-4 ${tone}`}>
      <div className="flex items-center gap-2 text-xs font-semibold">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}
