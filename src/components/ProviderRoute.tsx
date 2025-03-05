
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

        // Ensure the role is properly typed when setting the profile
        if (data) {
          const typedProfile: Partial<Profile> = {
            ...data,
            role: data.role as 'parent' | 'provider' | 'admin'
          };
          setProfile(typedProfile);
        } else {
          setProfile(null);
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
