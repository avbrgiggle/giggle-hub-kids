
import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import type { Profile } from "@/types/database.types";
import { getOrCreateProfile } from "@/services/profileService";

interface ProviderRouteProps {
  children: ReactNode;
}

const ProviderRoute = ({ children }: ProviderRouteProps) => {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setProfileLoading(false);
        return;
      }

      try {
        // Use the shared service to get or create the profile
        const userProfile = await getOrCreateProfile(user, 'provider');
        setProfile(userProfile);
      } catch (error) {
        console.error("Error loading profile:", error);
        setProfile(null);
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
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
