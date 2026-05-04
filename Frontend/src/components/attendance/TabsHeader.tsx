import { QrCode, UserRound, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export type TabKey = "teacher" | "student" | "records";

const tabs: { key: TabKey; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "teacher", label: "Teacher", Icon: QrCode },
  { key: "student", label: "Student", Icon: UserRound },
  { key: "records", label: "Records", Icon: FileText },
];

export function TabsHeader({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (k: TabKey) => void;
}) {
  return (
    <div className="rounded-2xl bg-card shadow-sm border border-border/40 px-6 py-6 sm:px-10 sm:py-8">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Student Attendance</h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground">
          QR Code Based Attendance System
        </p>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
        {tabs.map(({ key, label, Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg px-3 py-3 text-sm font-medium transition-colors cursor-pointer",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-secondary-foreground hover:bg-accent",
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden xs:inline sm:inline">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
