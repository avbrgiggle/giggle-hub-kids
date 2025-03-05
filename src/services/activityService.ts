
import { supabase } from "@/integrations/supabase/client";
import { StudentActivity } from "@/types/database.types";

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
