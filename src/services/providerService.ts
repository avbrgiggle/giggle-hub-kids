
import { supabase } from "@/integrations/supabase/client";
import { Student, StudentActivity, AttendanceRecord, Payment } from "@/types/database.types";

// Student Management
export const getStudents = async (providerId: string) => {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("provider_id", providerId)
    .order("last_name", { ascending: true });

  if (error) {
    console.error("Error fetching students:", error);
    throw error;
  }

  return data as Student[];
};

export const addStudent = async (student: Omit<Student, "id" | "created_at" | "updated_at">) => {
  const { data, error } = await supabase
    .from("students")
    .insert([student])
    .select()
    .single();

  if (error) {
    console.error("Error adding student:", error);
    throw error;
  }

  return data as Student;
};

export const updateStudent = async (id: string, student: Partial<Student>) => {
  const { data, error } = await supabase
    .from("students")
    .update(student)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating student:", error);
    throw error;
  }

  return data as Student;
};

export const deleteStudent = async (id: string) => {
  const { error } = await supabase
    .from("students")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting student:", error);
    throw error;
  }

  return true;
};

// Student Activity Management
export const getStudentActivities = async (providerId: string) => {
  const { data, error } = await supabase
    .from("student_activities")
    .select(`
      *,
      student:student_id(*),
      activity:activity_id(*)
    `)
    .eq("student.provider_id", providerId);

  if (error) {
    console.error("Error fetching student activities:", error);
    throw error;
  }

  return data as StudentActivity[];
};

export const addStudentActivity = async (studentActivity: Omit<StudentActivity, "id" | "created_at" | "updated_at">) => {
  const { data, error } = await supabase
    .from("student_activities")
    .insert([studentActivity])
    .select()
    .single();

  if (error) {
    console.error("Error adding student activity:", error);
    throw error;
  }

  return data as StudentActivity;
};

export const updateStudentActivity = async (id: string, studentActivity: Partial<StudentActivity>) => {
  const { data, error } = await supabase
    .from("student_activities")
    .update(studentActivity)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating student activity:", error);
    throw error;
  }

  return data as StudentActivity;
};

export const deleteStudentActivity = async (id: string) => {
  const { error } = await supabase
    .from("student_activities")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting student activity:", error);
    throw error;
  }

  return true;
};

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

// Payment Management
export const getPayments = async (providerId: string) => {
  const { data, error } = await supabase
    .from("payments")
    .select(`
      *,
      student_activity:student_activity_id(
        *,
        student:student_id(*),
        activity:activity_id(*)
      )
    `)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }

  // Filter payments to only include those for the provider's students
  const filteredPayments = data.filter(
    payment => payment.student_activity?.student?.provider_id === providerId
  );

  return filteredPayments as Payment[];
};

export const addPayment = async (payment: Omit<Payment, "id" | "created_at" | "updated_at">) => {
  const { data, error } = await supabase
    .from("payments")
    .insert([payment])
    .select()
    .single();

  if (error) {
    console.error("Error adding payment:", error);
    throw error;
  }

  return data as Payment;
};

export const updatePayment = async (id: string, payment: Partial<Payment>) => {
  const { data, error } = await supabase
    .from("payments")
    .update(payment)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating payment:", error);
    throw error;
  }

  return data as Payment;
};

// Get all extracurricular activities for a provider
export const getExtracurricularActivities = async (providerId: string) => {
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("provider_id", providerId)
    .eq("is_extracurricular", true)
    .order("title", { ascending: true });

  if (error) {
    console.error("Error fetching extracurricular activities:", error);
    throw error;
  }

  return data;
};
