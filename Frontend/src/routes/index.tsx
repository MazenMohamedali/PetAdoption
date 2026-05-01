import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TabsHeader, type TabKey } from "@/components/attendance/TabsHeader";
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
import * as api from "@/lib/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Student Attendance — QR Code Based System" },
      {
        name: "description",
        content:
          "Create classes, generate QR codes, and let students mark attendance instantly with a clean, modern interface.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [tab, setTab] = useState<TabKey>("teacher");
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  const createClass = async (name: string): Promise<ClassSession> => {
    const dto = await api.createSession({ name });
    const cls = fromDTO(dto);
    setClasses((c) => [cls, ...c]);
    return cls;
  };

  const deleteClass = async (id: string): Promise<void> => {
    await api.deleteSession(id);
    setClasses((c) => c.filter((x) => x.id !== id));
  };

  const scanQr = async (qrPayload: string, studentName: string): Promise<void> => {
    const { record } = await api.scanQr({
      qr_payload: qrPayload,
      student_name: studentName,
    });
    setRecords((r) => [fromAttendanceDTO(record), ...r]);
  };

  return (
    <main className="min-h-screen bg-background py-6 sm:py-10 px-4">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <TabsHeader active={tab} onChange={setTab} />
        {tab === "teacher" && (
          <TeacherPanel classes={classes} onCreate={createClass} onDelete={deleteClass} />
        )}
        {tab === "student" && <StudentPanel classes={classes} onScan={scanQr} />}
        {tab === "records" && <RecordsPanel classes={classes} records={records} />}
      </div>
    </main>
  );
}
