
import { useAuth } from "@/contexts/AuthContext";
import { ProfileCard } from "./components/ProfileCard";
import { ProfileTabs } from "./components/ProfileTabs";
import { ProfileLoadingIndicator } from "./components/ProfileLoadingIndicator";
import { useProfileData } from "./hooks/useProfileData";

export default function ProfilePage() {
  const { user } = useAuth();
  const { profile, loading } = useProfileData(user);

  if (loading) {
    return <ProfileLoadingIndicator />;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-8">
        <ProfileCard profile={profile} />
        <ProfileTabs userId={user?.id} />
      </div>
    </div>
  );
}
