
// This file now serves as a gateway to the other more specific service files
// By re-exporting everything, we maintain backward compatibility

export {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent
} from './studentService';

export {
  getStudentActivities,
  addStudentActivity,
  updateStudentActivity,
  deleteStudentActivity,
  getExtracurricularActivities
} from './activityService';

export {
  getAttendanceRecords,
  addAttendanceRecord,
  updateAttendanceRecord
} from './attendanceService';

export {
  getPayments,
  addPayment,
  updatePayment
} from './paymentService';

import { supabase } from "@/integrations/supabase/client";

// Provider request and signup code management

/**
 * Generates a unique signup code for a provider and saves it to the database
 */
export const generateProviderSignupCode = async (email: string): Promise<string> => {
  // Generate a random code
  const code = Math.random().toString(36).substring(2, 10).toUpperCase();
  
  // Set expiration date to 7 days from now
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  
  // Save the code to the database
  const { error } = await supabase
    .from("provider_signup_codes")
    .insert({
      code,
      email,
      expires_at: expiresAt.toISOString(),
      used: false
    });
    
  if (error) {
    console.error("Error generating signup code:", error);
    throw error;
  }
  
  return code;
};

/**
 * Validates a provider signup code
 */
export const validateProviderSignupCode = async (code: string): Promise<{isValid: boolean, email?: string}> => {
  try {
    const { data, error } = await supabase
      .from("provider_signup_codes")
      .select("*")
      .eq("code", code)
      .eq("used", false)
      .single();
      
    if (error) throw error;
    
    if (!data) {
      return { isValid: false };
    }
    
    // Check if code is expired
    if (new Date(data.expires_at) < new Date()) {
      return { isValid: false };
    }
    
    return { 
      isValid: true, 
      email: data.email 
    };
  } catch (error) {
    console.error("Error validating code:", error);
    return { isValid: false };
  }
};

/**
 * Mark a provider signup code as used
 */
export const markProviderCodeAsUsed = async (code: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("provider_signup_codes")
      .update({ used: true })
      .eq("code", code);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error marking code as used:", error);
    return false;
  }
};

/**
 * Get all provider requests with optional filtering by status
 */
export const getProviderRequests = async (status?: 'pending' | 'approved' | 'rejected') => {
  let query = supabase
    .from("provider_signup_requests")
    .select("*");
    
  if (status) {
    query = query.eq("status", status);
  }
  
  const { data, error } = await query.order("created_at", { ascending: false });
  
  if (error) {
    console.error("Error fetching provider requests:", error);
    throw error;
  }
  
  return data;
};

/**
 * Update a provider request status
 */
export const updateProviderRequestStatus = async (id: string, status: 'pending' | 'approved' | 'rejected') => {
  const { data, error } = await supabase
    .from("provider_signup_requests")
    .update({ status })
    .eq("id", id)
    .select()
    .single();
    
  if (error) {
    console.error("Error updating provider request:", error);
    throw error;
  }
  
  return data;
};
