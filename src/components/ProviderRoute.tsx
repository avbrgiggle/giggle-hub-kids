
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, ShieldAlert, AlertTriangle } from "lucide-react";
import type { Profile } from "@/types/database.types";
import { getOrCreateProfile } from "@/services/profileService";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ProviderRouteProps {
  children: ReactNode;
}

const ProviderRoute = ({ children }: ProviderRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<"access" | "general" | null>(null);
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
          setErrorType("general");
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
        
        // Check if this is an RLS policy error
        const isRLSError = error.message?.includes("row-level security") || 
                          error.message?.includes("policy") || 
                          error.code === "PGRST301";
        
        if (isRLSError) {
          const errorMsg = "Access denied: You don't have permission to view this profile";
          setError(errorMsg);
          setErrorType("access");
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "You don't have permission to access the provider dashboard"
          });
        } else {
          setError(error.message || "An unexpected error occurred");
          setErrorType("general");
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message || "Failed to load your profile"
          });
        }
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
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              {errorType === "access" ? (
                <ShieldAlert className="h-6 w-6 text-destructive" />
              ) : (
                <AlertTriangle className="h-6 w-6 text-destructive" />
              )}
              <CardTitle className="text-xl">
                {errorType === "access" ? "Access Denied" : "Error Loading Dashboard"}
              </CardTitle>
            </div>
            <CardDescription>
              {errorType === "access" 
                ? "You don't have the required permissions to access this area."
                : "There was a problem loading your provider dashboard."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>{errorType === "access" ? "Permission Error" : "System Error"}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            
            {errorType === "access" && (
              <p className="text-sm text-muted-foreground mt-2">
                If you believe this is a mistake, please contact support for assistance.
              </p>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
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
          </CardFooter>
        </Card>
      </div>
    );
  }

  console.log("ProviderRoute rendering children with profile:", profile?.id);
  return <>{children}</>;
};

export default ProviderRoute;
