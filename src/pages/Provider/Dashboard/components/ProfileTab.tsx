import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/types/database.types";

const ProfileTab = () => {
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        if (data) {
          // Ensure role is properly typed when setting the profile
          const typedProfile: Partial<Profile> = {
            ...data,
            role: data.role as 'parent' | 'provider' | 'admin',
          };
          setProfile(typedProfile);
        }
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile information",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from("profiles")
        .update(profile)
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <Input
            type="text"
            name="full_name"
            value={profile.full_name || ""}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <Input
            type="tel"
            name="phone"
            value={profile.phone || ""}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Location</label>
        <Input
          type="text"
          name="location"
          value={profile.location || ""}
          onChange={handleChange}
          className="mt-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Username</label>
        <Input
          type="text"
          name="username"
          value={profile.username || ""}
          onChange={handleChange}
          className="mt-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Preferred Communication</label>
        <Input
          type="text"
          name="preferred_communication"
          value={profile.preferred_communication || ""}
          onChange={handleChange}
          className="mt-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Preferred Payment Method</label>
        <Input
          type="text"
          name="preferred_payment_method"
          value={profile.preferred_payment_method || ""}
          onChange={handleChange}
          className="mt-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Referral Code</label>
        <Input
          type="text"
          name="referral_code"
          value={profile.referral_code || ""}
          onChange={handleChange}
          className="mt-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Provider Info</label>
        <Textarea
          name="provider_info"
          value={(profile.provider_info as string) || ""}
          onChange={handleChange}
          className="mt-1"
        />
      </div>
      <Button onClick={handleSave} disabled={saving}>
        {saving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            Update Profile
            <Check className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
};

export default ProfileTab;
