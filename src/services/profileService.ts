
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/types/database.types";
import { User } from "@supabase/supabase-js";

/**
 * Fetches a user's profile from the database
 * @param userId The ID of the user to fetch the profile for
 * @returns The user's profile, or null if not found
 */
export const fetchUserProfile = async (userId: string | undefined): Promise<Profile | null> => {
  if (!userId) return null;

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();  // Use maybeSingle instead of single to handle not found case without error

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }

    if (data) {
      // Ensure the role is properly typed
      return {
        ...data,
        role: data.role as 'parent' | 'provider' | 'admin'
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error in fetchUserProfile:", error);
    return null;
  }
};

/**
 * Creates a default profile for a user
 * @param user The user to create a profile for
 * @param role The role to assign to the user (defaults to 'parent')
 * @returns The newly created profile, or null if creation failed
 */
export const createDefaultProfile = async (
  user: User | null, 
  role: 'parent' | 'provider' | 'admin' = 'parent'
): Promise<Profile | null> => {
  if (!user) return null;
  
  try {
    // Create a default profile for the user
    const { error } = await supabase.from("profiles").insert({
      id: user.id,
      full_name: user.email?.split('@')[0] || 'New User',
      role: role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    if (error) {
      console.error("Error creating profile:", error);
      return null;
    }

    // Fetch the newly created profile
    const { data, error: fetchError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();
    
    if (fetchError || !data) {
      console.error("Error fetching new profile:", fetchError);
      return null;
    }

    // Ensure the role is properly typed
    return {
      ...data,
      role: data.role as 'parent' | 'provider' | 'admin'
    };
  } catch (error) {
    console.error("Error in createDefaultProfile:", error);
    return null;
  }
};

/**
 * Gets or creates a user profile
 * @param user The user to get or create a profile for
 * @param defaultRole The default role to assign if creating a new profile
 * @returns The user's profile, or null if retrieval and creation both failed
 */
export const getOrCreateProfile = async (
  user: User | null, 
  defaultRole: 'parent' | 'provider' | 'admin' = 'parent'
): Promise<Profile | null> => {
  if (!user) return null;
  
  try {
    // First try to fetch the existing profile
    const existingProfile = await fetchUserProfile(user.id);
    
    // If profile exists, return it
    if (existingProfile) {
      return existingProfile;
    }
    
    // If no profile exists, create a default one
    console.log(`No profile found for user ${user.id}, creating default with role ${defaultRole}`);
    const newProfile = await createDefaultProfile(user, defaultRole);
    
    return newProfile;
  } catch (error) {
    console.error("Error in getOrCreateProfile:", error);
    return null;
  }
};
