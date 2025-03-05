
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { Profile } from "@/types/database.types";
import { getOrCreateProfile } from "@/services/profileService";
import { ProfileCard } from "./components/ProfileCard";
import { ChildrenTabContent } from "./components/ChildrenTabContent";
import { ActivityTabContent } from "./components/ActivityTabContent";
import { MessageTabContent } from "./components/MessageTabContent";

export default function ProfilePage() {
  const { user } = useAuth();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-8">
        <ProfileCard profile={profile} />

        <Tabs defaultValue="children" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="children">Children</TabsTrigger>
            <TabsTrigger value="activities">Booked Activities</TabsTrigger>
            <TabsTrigger value="messages">Provider Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="children">
            <ChildrenTabContent userId={user?.id} />
          </TabsContent>

          <TabsContent value="activities">
            <ActivityTabContent />
          </TabsContent>

          <TabsContent value="messages">
            <MessageTabContent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
