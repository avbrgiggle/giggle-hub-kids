
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface ProviderProfile {
  full_name: string;
  username: string;
  phone: string;
  location: string;
  provider_info: {
    description?: string;
    website_url?: string;
    facebook_url?: string;
    instagram_url?: string;
    linkedin_url?: string;
    tiktok_url?: string;
  } | null;
}

export default function ProfileTab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProviderProfile>({
    full_name: "",
    username: "",
    phone: "",
    location: "",
    provider_info: {
      description: "",
      website_url: "",
      facebook_url: "",
      instagram_url: "",
      linkedin_url: "",
      tiktok_url: "",
    },
  });
  
  useEffect(() => {
    if (!user) return;
    fetchProfile();
  }, [user]);
  
  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();
        
      if (error) throw error;
      
      setProfile({
        full_name: data.full_name || "",
        username: data.username || "",
        phone: data.phone || "",
        location: data.location || "",
        provider_info: data.provider_info || {
          description: "",
          website_url: "",
          facebook_url: "",
          instagram_url: "",
          linkedin_url: "",
          tiktok_url: "",
        },
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load profile information",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parentField, childField] = field.split('.');
      setProfile(prev => ({
        ...prev,
        [parentField]: {
          ...prev[parentField as keyof ProviderProfile],
          [childField]: value
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          username: profile.username,
          phone: profile.phone,
          location: profile.location,
          provider_info: profile.provider_info,
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id);
        
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update profile",
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
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Provider Profile</h2>
        <p className="text-muted-foreground">Manage your provider information and settings</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Update your account details and personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profile.full_name}
                    onChange={(e) => handleInputChange("full_name", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={profile.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Provider Information</CardTitle>
              <CardDescription>
                This information will be displayed on your public provider profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Provider Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={profile.provider_info?.description || ""}
                  onChange={(e) => handleInputChange("provider_info.description", e.target.value)}
                  placeholder="Describe your organization, services, and what makes your activities special"
                />
              </div>
              
              <Separator className="my-4" />
              
              <h3 className="text-lg font-medium mb-4">Social Media & Web Presence</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="websiteUrl">Website URL</Label>
                  <Input
                    id="websiteUrl"
                    value={profile.provider_info?.website_url || ""}
                    onChange={(e) => handleInputChange("provider_info.website_url", e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="facebookUrl">Facebook URL</Label>
                  <Input
                    id="facebookUrl"
                    value={profile.provider_info?.facebook_url || ""}
                    onChange={(e) => handleInputChange("provider_info.facebook_url", e.target.value)}
                    placeholder="https://facebook.com/page"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instagramUrl">Instagram URL</Label>
                  <Input
                    id="instagramUrl"
                    value={profile.provider_info?.instagram_url || ""}
                    onChange={(e) => handleInputChange("provider_info.instagram_url", e.target.value)}
                    placeholder="https://instagram.com/handle"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                  <Input
                    id="linkedinUrl"
                    value={profile.provider_info?.linkedin_url || ""}
                    onChange={(e) => handleInputChange("provider_info.linkedin_url", e.target.value)}
                    placeholder="https://linkedin.com/in/profile"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tiktokUrl">TikTok URL</Label>
                  <Input
                    id="tiktokUrl"
                    value={profile.provider_info?.tiktok_url || ""}
                    onChange={(e) => handleInputChange("provider_info.tiktok_url", e.target.value)}
                    placeholder="https://tiktok.com/@handle"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {saving ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
