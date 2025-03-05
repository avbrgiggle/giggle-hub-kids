
import { supabase } from "@/integrations/supabase/client";
import { Payment } from "@/types/database.types";

// Payment Management
export const getPayments = async (providerId: string) => {
  // Get all student IDs for this provider
  const { data: students, error: studentsError } = await supabase
    .from("students")
    .select("id")
    .eq("provider_id", providerId);

  if (studentsError) {
    console.error("Error fetching students:", studentsError);
    throw studentsError;
  }

  const studentIds = students.map(s => s.id);

  // Get all student activities for these students
  const { data: activities, error: activitiesError } = await supabase
    .from("student_activities")
    .select("id")
    .in("student_id", studentIds);

  if (activitiesError) {
    console.error("Error fetching student activities:", activitiesError);
    throw activitiesError;
  }

  const activityIds = activities.map(a => a.id);

  // Get payments for these student activities
  const { data: payments, error: paymentsError } = await supabase
    .from("payments")
    .select("*")
    .in("student_activity_id", activityIds)
    .order("date", { ascending: false });

  if (paymentsError) {
    console.error("Error fetching payments:", paymentsError);
    throw paymentsError;
  }

  return payments as Payment[];
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
