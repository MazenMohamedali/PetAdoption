import { useEffect, useRef, useState } from "react";
import { UserRound, Camera, Check, XCircle, X } from "lucide-react";
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
  /** Sends raw qr_payload + student_name to the backend `/attendance/scan` endpoint. */
  onScan: (qrPayload: string, studentName: string) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const canScan = name.trim().length > 0 && !submitting;

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraOpen(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const handleScan = async () => {
    if (!canScan) return;
    setCameraError(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Failed to start camera. Please check permissions.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOpen(true);
      // Attach stream after the video element mounts
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      });
    } catch {
      setCameraError("Failed to start camera. Please check permissions.");
    }
  };

  const handleConfirmScan = async () => {
    const cls = classes[0];
    if (!cls) {
      alert("No active class. Ask your teacher to create one first.");
      return;
    }
    setSubmitting(true);
    try {
      await onScan(cls.qrPayload, name.trim());
      setSuccess(true);
      setName("");
      stopCamera();
      setTimeout(() => setSuccess(false), 2500);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl bg-card shadow-sm border border-border/40 px-6 py-6 sm:px-8 sm:py-7">
      <h2 className="text-lg sm:text-xl font-bold text-foreground">Mark Your Attendance</h2>

      <div className="mt-5">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <UserRound className="h-4 w-4" />
          Your Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
          className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <button
        onClick={handleScan}
        disabled={!canScan}
        className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-muted px-4 py-3 text-sm font-semibold text-muted-foreground enabled:bg-primary enabled:text-primary-foreground enabled:hover:bg-primary/90 enabled:cursor-pointer transition-colors disabled:cursor-not-allowed"
      >
        {success ? <Check className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
        {success ? "Attendance Recorded" : submitting ? "Scanning…" : "Scan QR Code"}
      </button>

      {cameraError && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <XCircle className="h-4 w-4 shrink-0" />
          <span>{cameraError}</span>
        </div>
      )}

      {cameraOpen && (
        <div className="mt-4 rounded-lg overflow-hidden border border-border/60 bg-black relative">
          <video ref={videoRef} className="w-full h-64 object-cover" playsInline muted />
          <button
            onClick={stopCamera}
            className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80 cursor-pointer"
            aria-label="Close camera"
          >
            <X className="h-4 w-4" />
          </button>
          <button
            onClick={handleConfirmScan}
            disabled={submitting}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting…" : "Confirm Scan"}
          </button>
        </div>
      )}

      <div className="mt-5 rounded-lg border border-primary/20 bg-accent/40 p-4 text-xs text-primary">
        <p className="font-semibold">Instructions:</p>
        <ol className="mt-1 space-y-0.5">
          <li>1. Enter your name above</li>
          <li>2. Click "Scan QR Code"</li>
          <li>3. Point your camera at the QR code displayed by your teacher</li>
          <li>4. Wait for automatic scanning confirmation</li>
        </ol>
      </div>
    </div>
  );
}
