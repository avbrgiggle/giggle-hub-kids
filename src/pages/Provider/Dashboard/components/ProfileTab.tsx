
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { Profile } from "@/types/database.types";

export default function ProfileTab() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Partial<Profile>>({});

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
      
      setProfile(data || {});
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

  const handleInputChange = (field: string, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          location: profile.location,
          // Add other fields as needed
        })
        .eq("id", user?.id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Provider Profile</h2>
        <p className="text-muted-foreground">Manage your provider information</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Provider Name</Label>
                <Input
                  id="fullName"
                  value={profile.full_name || ""}
                  onChange={(e) => handleInputChange("full_name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user?.email || ""}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={profile.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={profile.location || ""}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">About</Label>
              <Textarea
                id="description"
                rows={4}
                value={profile.provider_info?.description || ""}
                onChange={(e) => {
                  const providerInfo = {...(profile.provider_info || {})};
                  providerInfo.description = e.target.value;
                  handleInputChange("provider_info", providerInfo);
                }}
                placeholder="Tell parents about your activities and services..."
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={saveProfile} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving
                  </>
                ) : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={profile.provider_info?.website_url || ""}
                onChange={(e) => {
                  const providerInfo = {...(profile.provider_info || {})};
                  providerInfo.website_url = e.target.value;
                  handleInputChange("provider_info", providerInfo);
                }}
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                value={profile.provider_info?.facebook_url || ""}
                onChange={(e) => {
                  const providerInfo = {...(profile.provider_info || {})};
                  providerInfo.facebook_url = e.target.value;
                  handleInputChange("provider_info", providerInfo);
                }}
                placeholder="https://facebook.com/page"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={profile.provider_info?.instagram_url || ""}
                onChange={(e) => {
                  const providerInfo = {...(profile.provider_info || {})};
                  providerInfo.instagram_url = e.target.value;
                  handleInputChange("provider_info", providerInfo);
                }}
                placeholder="https://instagram.com/handle"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID</Label>
              <Input
                id="taxId"
                value={profile.provider_info?.tax_id || ""}
                onChange={(e) => {
                  const providerInfo = {...(profile.provider_info || {})};
                  providerInfo.tax_id = e.target.value;
                  handleInputChange("provider_info", providerInfo);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMethods">Accepted Payment Methods</Label>
              <Input
                id="paymentMethods"
                value={profile.provider_info?.payment_methods || ""}
                onChange={(e) => {
                  const providerInfo = {...(profile.provider_info || {})};
                  providerInfo.payment_methods = e.target.value;
                  handleInputChange("provider_info", providerInfo);
                }}
                placeholder="Credit Card, Bank Transfer, PayPal"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
