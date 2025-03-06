
import { supabase } from "@/integrations/supabase/client";
import { AttendanceRecord } from "@/types/database.types";

// Attendance Management

/**
 * Get attendance records for specific student activities and date
 */
export const getAttendanceRecords = async (
  studentActivityIds: string[],
  date?: string
) => {
  let query = supabase
    .from("attendance_records")
    .select("*")
    .in("student_activity_id", studentActivityIds);
    
  if (date) {
    query = query.eq("date", date);
  }
  
  const { data, error } = await query.order("date", { ascending: false });

  if (error) {
    console.error("Error fetching attendance records:", error);
    throw error;
  }

  return data as AttendanceRecord[];
};

/**
 * Add a new attendance record
 */
export const addAttendanceRecord = async (
  record: Omit<AttendanceRecord, "id" | "created_at" | "updated_at">
) => {
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

/**
 * Update an existing attendance record
 */
export const updateAttendanceRecord = async (
  id: string,
  record: Partial<AttendanceRecord>
) => {
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

/**
 * Get attendance statistics for a specific activity
 */
export const getAttendanceStats = async (activityId: string) => {
  try {
    // Get all student activities for this activity
    const { data: studentActivities, error: saError } = await supabase
      .from("student_activities")
      .select("id")
      .eq("activity_id", activityId);
      
    if (saError) throw saError;
    
    const studentActivityIds = studentActivities.map(sa => sa.id);
    
    if (studentActivityIds.length === 0) {
      return {
        total: 0,
        present: 0,
        absent: 0,
        late: 0,
        excused: 0
      };
    }
    
    // Get attendance records for these student activities
    const { data: records, error: recordsError } = await supabase
      .from("attendance_records")
      .select("status")
      .in("student_activity_id", studentActivityIds);
      
    if (recordsError) throw recordsError;
    
    const stats = {
      total: records.length,
      present: records.filter(r => r.status === 'present').length,
      absent: records.filter(r => r.status === 'absent').length,
      late: records.filter(r => r.status === 'late').length,
      excused: records.filter(r => r.status === 'excused').length
    };
    
    return stats;
  } catch (error) {
    console.error("Error getting attendance stats:", error);
    throw error;
  }
};
