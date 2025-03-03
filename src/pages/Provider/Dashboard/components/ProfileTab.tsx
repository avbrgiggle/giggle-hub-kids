
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Profile } from "@/types/database.types";

export function ProfileTab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      setProfile(data as Profile);
    } catch (error: any) {
      console.error("Error fetching profile:", error.message);
      toast({
        variant: "destructive",
        title: "Error fetching profile",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          location: profile.location,
        })
        .eq("id", user?.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error.message);
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={profile?.full_name || ""}
                onChange={(e) => setProfile(prev => prev ? {...prev, full_name: e.target.value} : null)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profile?.phone || ""}
                onChange={(e) => setProfile(prev => prev ? {...prev, phone: e.target.value} : null)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profile?.location || ""}
                onChange={(e) => setProfile(prev => prev ? {...prev, location: e.target.value} : null)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Account Type</Label>
              <Input id="role" value={profile?.role || ""} disabled className="bg-muted" />
            </div>
            
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {profile?.role === "provider" && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Provider Information</h3>
            <div className="space-y-4">
              {/* This will be expanded in the future to edit provider-specific information */}
              <p className="text-sm text-muted-foreground">
                Additional provider settings will be available soon.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
