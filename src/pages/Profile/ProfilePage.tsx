
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

  const fetchProfileAndChildren = async () => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (profileError) throw profileError;

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
      }

      await fetchChildren();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
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
