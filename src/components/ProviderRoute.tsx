
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import type { Profile } from "@/types/database.types";
import { getOrCreateProfile } from "@/services/profileService";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface ProviderRouteProps {
  children: ReactNode;
}

const ProviderRoute = ({ children }: ProviderRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  console.log("ProviderRoute render - User:", user?.id, "Auth loading:", authLoading);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        console.log("No user, skipping profile load");
        setProfileLoading(false);
        return;
      }

      try {
        console.log("Loading profile for user:", user.id);
        const userProfile = await getOrCreateProfile(user, 'provider');
        console.log("Profile loaded:", userProfile);
        
        if (!userProfile) {
          const errorMsg = "Could not load profile";
          console.error(errorMsg);
          setError(errorMsg);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not load your profile. Please try again."
          });
        } else {
          setProfile(userProfile);
        }
      } catch (error: any) {
        console.error("Error loading profile:", error);
        setError(error.message || "An unexpected error occurred");
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to load your profile"
        });
      } finally {
        setProfileLoading(false);
      }
    };

    if (!authLoading) {
      loadProfile();
    }
  }, [user, authLoading, toast]);

  // Show loading spinner while auth and profile are loading
  if (authLoading || profileLoading) {
    console.log("ProviderRoute loading - Auth:", authLoading, "Profile:", profileLoading);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p className="text-muted-foreground">Loading your dashboard...</p>
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
        <div className="flex gap-2">
          <Button 
            onClick={() => window.location.reload()}
            variant="default"
          >
            Try Again
          </Button>
          <Button 
            onClick={() => navigate("/")}
            variant="outline"
          >
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  console.log("ProviderRoute rendering children with profile:", profile?.id);
  return <>{children}</>;
};

export default ProviderRoute;
