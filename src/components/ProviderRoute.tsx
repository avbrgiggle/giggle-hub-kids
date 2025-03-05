
import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/types/database.types";

interface ProviderRouteProps {
  children: ReactNode;
}

const ProviderRoute = ({ children }: ProviderRouteProps) => {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<Partial<Profile> | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const createDefaultProfile = async () => {
    if (!user) return null;
    
    try {
      // Create a default profile for the user
      const { error } = await supabase.from("profiles").insert({
        id: user.id,
        full_name: user.email?.split('@')[0] || 'New Provider',
        role: 'provider',
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

      return data;
    } catch (error) {
      console.error("Error in createDefaultProfile:", error);
      return null;
    }
  };

  useEffect(() => {
    const getProfile = async () => {
      if (!user) {
        setProfileLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();  // Use maybeSingle instead of single to handle not found case without error

        if (error) {
          console.error("Error fetching profile:", error);
          setProfile(null);
          setProfileLoading(false);
          return;
        }

        // If profile exists, use it
        if (data) {
          // Ensure the role is properly typed when setting the profile
          const typedProfile: Partial<Profile> = {
            ...data,
            role: data.role as 'parent' | 'provider' | 'admin'
          };
          setProfile(typedProfile);
        } else {
          // If no profile exists, create a default one
          console.log("No profile found in ProviderRoute, creating default");
          const newProfile = await createDefaultProfile();
          
          if (newProfile) {
            const typedProfile: Partial<Profile> = {
              ...newProfile,
              role: newProfile.role as 'parent' | 'provider' | 'admin'
            };
            setProfile(typedProfile);
          } else {
            setProfile(null);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setProfile(null);
      } finally {
        setProfileLoading(false);
      }
    };

    getProfile();
  }, [user]);

  // Show loading spinner while auth and profile are loading
  if (loading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is a provider
  const isProvider = profile?.role === "provider";
  
  if (!isProvider) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProviderRoute;
