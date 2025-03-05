
import { supabase } from "@/integrations/supabase/client";
import { Student } from "@/types/database.types";

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
