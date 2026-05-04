import { useState } from "react";
import { Check, Copy, Link as LinkIcon, ScanLine } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import type { ClassSession } from "./TeacherPanel";
import type { AttendanceDTO } from "@/lib/api";

/** UI-friendly alias. Backend shape (AttendanceDTO) lives in @/lib/api/types. */
export type AttendanceRecord = {
  id: string;
  studentName: string;
  classId: string;     // course name (backend doesn't return id on scan response)
  className: string;
  timestamp: number;
};

export function fromAttendanceDTO(dto: AttendanceDTO): AttendanceRecord {
  return {
    id: String(dto.id),
    studentName: dto.studentName,
    classId: dto.courseName,
    className: dto.courseName,
    timestamp: new Date(dto.scannedAt).getTime(),
  };
}

export function StudentPanel({
  classes,
  onScan,
}: {
  classes: ClassSession[];
  /** Sends raw qr_payload to the backend `/attendance/scan` endpoint. */
  onScan: (qrPayload: string) => Promise<void>;
}) {
  const [joinLink, setJoinLink] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeClass, setActiveClass] = useState<ClassSession | null>(null);
  const [copied, setCopied] = useState(false);

  const canScan = joinLink.trim().length > 0 && !submitting;

  const handleConfirmScan = async () => {
    if (!canScan) return;
    setSubmitting(true);
    try {
      // Pass the joinLink (qrPayload).
      await onScan(joinLink.trim());
      setSuccess(true);
      setJoinLink("");
      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      alert("Failed to join course. Please check the link and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const copy = async (text: string) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-2xl bg-card shadow-sm border border-border/40 px-6 py-6 sm:px-8 sm:py-7">
      <h2 className="text-lg sm:text-xl font-bold text-foreground">Active Courses</h2>

      <div className="mt-4 mb-6">
        {classes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No active courses available right now.</p>
        ) : (
          <ul className="space-y-3">
            {classes.map((c) => {
              const isActive = activeClass?.id === c.id;
              return (
                <li
                  key={c.id}
                  onClick={() => setActiveClass(isActive ? null : c)}
                  className={`flex flex-col rounded-xl border px-4 py-3 cursor-pointer transition-colors ${
                    isActive
                      ? "border-primary bg-accent/60"
                      : "border-border bg-card hover:bg-secondary/40"
                  }`}
                >
                  <div>
                    <p className="text-sm font-bold text-foreground">{c.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {c.description || "No description provided."}
                    </p>
                  </div>
                  {isActive && (
                    <div className="mt-4 flex flex-col items-center rounded-lg bg-background p-4 border border-border">
                      <div className="rounded-xl border-2 border-primary p-3 bg-white">
                        <QRCodeSVG value={c.qrPayload} size={150} />
                      </div>
                      <p className="mt-3 text-xs text-muted-foreground text-center">
                        Scan or copy this link to join the class
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copy(c.qrPayload);
                        }}
                        className="mt-2 inline-flex items-center gap-2 text-xs font-medium text-primary hover:underline cursor-pointer"
                      >
                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        {copied ? "Copied" : "Copy join link"}
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="mt-6 border-t border-border pt-6">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <LinkIcon className="h-4 w-4" />
          Enter Join Link
        </label>
        <input
          value={joinLink}
          onChange={(e) => setJoinLink(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleConfirmScan()}
          placeholder="Paste the course join link here"
          className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
        />

        <button
          onClick={handleConfirmScan}
          disabled={!canScan}
          className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-muted px-4 py-3 text-sm font-semibold text-muted-foreground enabled:bg-primary enabled:text-primary-foreground enabled:hover:bg-primary/90 enabled:cursor-pointer transition-colors disabled:cursor-not-allowed"
        >
          {success ? <Check className="h-4 w-4" /> : <ScanLine className="h-4 w-4" />}
          {success ? "Attendance Recorded" : submitting ? "Joining…" : "Join Course"}
        </button>
      </div>

      <div className="mt-5 rounded-lg border border-primary/20 bg-accent/40 p-4 text-xs text-primary">
        <p className="font-semibold">Instructions:</p>
        <ol className="mt-1 space-y-0.5">
          <li>1. Click on an active course above to view its details.</li>
          <li>2. Click "Copy join link" to copy the course's unique join code.</li>
          <li>3. Paste the code into the "Enter Join Link" field below.</li>
          <li>4. Click "Join Course" to mark your attendance.</li>
        </ol>
      </div>
    </div>
  );
}
