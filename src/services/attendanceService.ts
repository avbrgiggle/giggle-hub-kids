
import { supabase } from "@/integrations/supabase/client";
import { AttendanceRecord } from "@/types/database.types";

// Attendance Records
export const getAttendanceRecords = async (studentActivityId: string) => {
  const { data, error } = await supabase
    .from("attendance_records")
    .select("*")
    .eq("student_activity_id", studentActivityId)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching attendance records:", error);
    throw error;
  }

  return data as AttendanceRecord[];
};

export const addAttendanceRecord = async (record: Omit<AttendanceRecord, "id" | "created_at" | "updated_at">) => {
  const { data, error } = await supabase
    .from("attendance_records")
    .insert([record])
    .select()
    .single();

  if (error) {
    console.error("Error adding attendance record:", error);
    throw error;
  }

  return data as AttendanceRecord;
};

export const updateAttendanceRecord = async (id: string, record: Partial<AttendanceRecord>) => {
  const { data, error } = await supabase
    .from("attendance_records")
    .update(record)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating attendance record:", error);
    throw error;
  }

  return data as AttendanceRecord;
};
