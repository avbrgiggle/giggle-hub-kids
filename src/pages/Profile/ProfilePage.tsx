
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ProfileCard } from "./components/ProfileCard";
import { ProfileTabs } from "./components/ProfileTabs";
import { ProfileLoadingIndicator } from "./components/ProfileLoadingIndicator";
import { useProfileData } from "./hooks/useProfileData";

export default function ProfilePage() {
  const { user } = useAuth();
  const { profile, loading } = useProfileData(user);
  const navigate = useNavigate();

  if (loading) {
    return <ProfileLoadingIndicator />;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
        <ProfileCard profile={profile} />
        <ProfileTabs userId={user?.id} />
      </div>
    </div>
  );
}
