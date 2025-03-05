
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, MessageSquare, PlusCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/types/database.types";
import { useChildren } from "./hooks/useChildren";
import { ChildList } from "./components/ChildList";
import { AddChildForm } from "./components/AddChildForm";

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  
  const {
    children,
    loading: childrenLoading,
    showAddChild,
    newChild,
    setShowAddChild,
    setNewChild,
    handleAddChild,
    toggleInterest,
    fetchChildren,
  } = useChildren(user?.id);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchProfileAndChildren();
  }, [user, navigate]);

  const createDefaultProfile = async () => {
    try {
      // Create a default profile for the user
      const { error } = await supabase.from("profiles").insert({
        id: user?.id,
        full_name: user?.email?.split('@')[0] || 'New User',
        role: 'provider', // Since this is a provider test user
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      if (error) {
        console.error("Error creating profile:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create your profile. Please try again."
        });
        return null;
      }

      // Fetch the newly created profile
      const { data: newProfile, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .maybeSingle();
      
      if (fetchError || !newProfile) {
        console.error("Error fetching new profile:", fetchError);
        return null;
      }

      return newProfile;
    } catch (error) {
      console.error("Error in createDefaultProfile:", error);
      return null;
    }
  };

  const fetchProfileAndChildren = async () => {
    try {
      // Use .eq() to ensure we're only getting the profile for the current user
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .maybeSingle();  // Changed from .single() to .maybeSingle() to handle the case when no profile is found

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile information.",
        });
        return;
      }

      if (profileData) {
        // Ensure the role is properly typed when setting the profile
        const typedProfile: Profile = {
          ...profileData,
          role: profileData.role as 'parent' | 'provider' | 'admin',
          full_name: profileData.full_name || null,
          avatar_url: profileData.avatar_url || null,
          phone: profileData.phone || null,
          location: profileData.location || null,
          username: profileData.username || null,
          preferred_communication: profileData.preferred_communication || null,
          preferred_payment_method: profileData.preferred_payment_method || null,
          referral_code: profileData.referral_code || null,
          provider_info: profileData.provider_info || null
        };
        setProfile(typedProfile);
      } else {
        // Instead of showing an error, create a default profile
        console.log("No profile found, attempting to create one");
        const newProfile = await createDefaultProfile();
        
        if (newProfile) {
          const typedProfile: Profile = {
            ...newProfile,
            role: newProfile.role as 'parent' | 'provider' | 'admin',
            full_name: newProfile.full_name || null,
            avatar_url: newProfile.avatar_url || null,
            phone: newProfile.phone || null,
            location: newProfile.location || null,
            username: newProfile.username || null,
            preferred_communication: newProfile.preferred_communication || null,
            preferred_payment_method: newProfile.preferred_payment_method || null,
            referral_code: newProfile.referral_code || null,
            provider_info: newProfile.provider_info || null
          };
          setProfile(typedProfile);
        } else {
          // Only show error if we failed to create a profile
          toast({
            variant: "destructive",
            title: "Error",
            description: "Profile not found and couldn't be created. Please contact support."
          });
        }
      }

      await fetchChildren();
    } catch (error: any) {
      console.error("Error in fetchProfileAndChildren:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading || childrenLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <Label>Full Name</Label>
                <p className="text-lg">{profile?.full_name}</p>
              </div>
              <div>
                <Label>Phone</Label>
                <p className="text-lg">{profile?.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="children" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="children">Children</TabsTrigger>
            <TabsTrigger value="activities">Booked Activities</TabsTrigger>
            <TabsTrigger value="messages">Provider Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="children">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Children</CardTitle>
                <Button onClick={() => setShowAddChild(true)} variant="outline">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Child
                </Button>
              </CardHeader>
              <CardContent>
                {children.length === 0 ? (
                  <p className="text-muted-foreground">No children added yet.</p>
                ) : (
                  <ChildList children={children} />
                )}

                {showAddChild && (
                  <AddChildForm
                    newChild={newChild}
                    onSubmit={handleAddChild}
                    onCancel={() => setShowAddChild(false)}
                    onNewChildChange={(field, value) =>
                      setNewChild((prev) => ({ ...prev, [field]: value }))
                    }
                    onToggleInterest={toggleInterest}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities">
            <Card>
              <CardHeader>
                <CardTitle>Booked Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No activities booked yet.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Provider Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-2 text-muted-foreground">
                    No messages yet. Book an activity to start chatting with providers.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
