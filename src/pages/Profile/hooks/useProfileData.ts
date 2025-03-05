
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { getOrCreateProfile } from "@/services/profileService";
import type { Profile } from "@/types/database.types";
import type { User } from "@supabase/supabase-js";

export function useProfileData(user: User | null) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const loadProfile = async () => {
      try {
        setLoading(true);
        // Use the shared service to get or create the profile with parent as default role
        const userProfile = await getOrCreateProfile(user, 'parent');
        
        if (userProfile) {
          setProfile(userProfile);
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load profile information. Please try again."
          });
        }
      } catch (error: any) {
        console.error("Error in loadProfile:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "An unexpected error occurred"
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, navigate, toast]);

  return { profile, loading };
}
