
import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import type { Profile } from "@/types/database.types";
import { getOrCreateProfile } from "@/services/profileService";
import { useToast } from "@/hooks/use-toast";

interface ProviderRouteProps {
  children: ReactNode;
}

const ProviderRoute = ({ children }: ProviderRouteProps) => {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setProfileLoading(false);
        return;
      }

      try {
        console.log("Loading profile for user:", user.id);
        // Use the shared service to get or create the profile
        const userProfile = await getOrCreateProfile(user, 'provider');
        console.log("Profile loaded:", userProfile);
        setProfile(userProfile);
        
        if (!userProfile) {
          setError("Could not load profile");
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not load your profile. Please try again."
          });
        }
      } catch (error: any) {
        console.error("Error loading profile:", error);
        setError(error.message || "An unexpected error occurred");
        setProfile(null);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to load your profile"
        });
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, [user, toast]);

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
    console.log("User not logged in, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Check if user is a provider
  const isProvider = profile?.role === "provider";
  
  if (!isProvider) {
    console.log("User is not a provider, redirecting to home");
    toast({
      variant: "destructive",
      title: "Access Denied",
      description: "You do not have provider access."
    });
    return <Navigate to="/" replace />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h2 className="text-xl font-semibold text-red-500">Error Loading Provider Dashboard</h2>
        <p className="text-gray-600">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProviderRoute;
