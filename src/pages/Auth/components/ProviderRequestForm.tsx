
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, UploadCloud } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ProviderSignupRequest } from "@/types/database.types";

interface ProviderRequestFormData {
  name: string;
  email: string;
  websiteUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  tiktokUrl: string;
  activityTypes: string[];
  location: string;
  ageRange: string;
  durationTypes: string[];
  contactInfo: string;
  logo: File | null;
}

const activityTypeOptions = [
  "Sports", "Arts & Crafts", "Music", "Dance", "STEM", "Languages", 
  "Cooking", "Outdoor Adventure", "Coding", "Robotics", "Theatre"
];

const durationTypeOptions = [
  "Weekends", "Holidays", "After School", "Summer Camps", "Year-Round"
];

export function ProviderRequestForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProviderRequestFormData>({
    name: "",
    email: "",
    websiteUrl: "",
    facebookUrl: "",
    instagramUrl: "",
    linkedinUrl: "",
    tiktokUrl: "",
    activityTypes: [],
    location: "",
    ageRange: "",
    durationTypes: [],
    contactInfo: "",
    logo: null,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleActivityType = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      activityTypes: prev.activityTypes.includes(type)
        ? prev.activityTypes.filter((t) => t !== type)
        : [...prev.activityTypes, type],
    }));
  };

  const toggleDurationType = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      durationTypes: prev.durationTypes.includes(type)
        ? prev.durationTypes.filter((t) => t !== type)
        : [...prev.durationTypes, type],
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      setFormData((prev) => ({
        ...prev,
        logo: file,
      }));
      
      // Generate preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({
        ...prev,
        logo: null,
      }));
      setLogoPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.location || 
        !formData.ageRange || formData.activityTypes.length === 0 || 
        formData.durationTypes.length === 0 || !formData.contactInfo) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields.",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      let logoUrl = null;
      
      // Upload logo if provided
      if (formData.logo) {
        const fileExt = formData.logo.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `provider-logos/${fileName}`;
        
        // Check if the storage bucket exists, if not create it
        const { error: bucketError } = await supabase.storage.getBucket('provider-assets');
        if (bucketError) {
          // Bucket doesn't exist, create it
          const { error: createError } = await supabase.storage.createBucket('provider-assets', {
            public: true,
          });
          if (createError) throw createError;
        }
        
        // Upload the file
        const { error: uploadError } = await supabase.storage
          .from('provider-assets')
          .upload(filePath, formData.logo);
          
        if (uploadError) throw uploadError;
        
        // Get the public URL
        const { data: urlData } = supabase.storage
          .from('provider-assets')
          .getPublicUrl(filePath);
          
        logoUrl = urlData.publicUrl;
      }

      const requestData = {
        name: formData.name,
        email: formData.email,
        website_url: formData.websiteUrl || null,
        facebook_url: formData.facebookUrl || null,
        instagram_url: formData.instagramUrl || null,
        linkedin_url: formData.linkedinUrl || null,
        tiktok_url: formData.tiktokUrl || null,
        activity_types: formData.activityTypes,
        location: formData.location,
        age_range: formData.ageRange,
        duration_types: formData.durationTypes,
        contact_info: formData.contactInfo,
        logo_url: logoUrl,
        status: 'pending' as const
      };

      const { error } = await supabase
        .from("provider_signup_requests")
        .insert(requestData);

      if (error) throw error;

      toast({
        title: "Request submitted",
        description: "Your provider access request has been submitted. You'll receive an email when approved.",
      });
      
      navigate("/login");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit request. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Provider Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactInfo">Contact Information *</Label>
          <Textarea
            id="contactInfo"
            value={formData.contactInfo}
            onChange={(e) => handleInputChange("contactInfo", e.target.value)}
            required
            placeholder="Phone number, preferred contact method, etc."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            required
            placeholder="City, region or specific location"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ageRange">Age Range *</Label>
          <Input
            id="ageRange"
            value={formData.ageRange}
            onChange={(e) => handleInputChange("ageRange", e.target.value)}
            required
            placeholder="e.g., 5-12 years"
          />
        </div>

        <div className="space-y-2">
          <Label>Activity Types *</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {activityTypeOptions.map((type) => (
              <Button
                key={type}
                type="button"
                variant={formData.activityTypes.includes(type) ? "default" : "outline"}
                className="justify-start"
                onClick={() => toggleActivityType(type)}
              >
                {formData.activityTypes.includes(type) ? (
                  <Check className="mr-2 h-4 w-4" />
                ) : (
                  <div className="w-4 mr-2" />
                )}
                {type}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Duration Types *</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {durationTypeOptions.map((type) => (
              <Button
                key={type}
                type="button"
                variant={formData.durationTypes.includes(type) ? "default" : "outline"}
                className="justify-start"
                onClick={() => toggleDurationType(type)}
              >
                {formData.durationTypes.includes(type) ? (
                  <Check className="mr-2 h-4 w-4" />
                ) : (
                  <div className="w-4 mr-2" />
                )}
                {type}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="logo">Company Logo</Label>
          <div className="border rounded-md p-4 flex flex-col items-center justify-center bg-gray-50">
            {logoPreview ? (
              <div className="mb-4">
                <img 
                  src={logoPreview} 
                  alt="Logo preview" 
                  className="w-32 h-32 object-contain"
                />
              </div>
            ) : (
              <div className="mb-4 w-32 h-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                <UploadCloud className="h-8 w-8 text-gray-400" />
              </div>
            )}
            <Input
              id="logo"
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="max-w-sm"
            />
            <p className="text-xs text-gray-500 mt-2">Upload your company logo (recommended size: 200x200px)</p>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-lg font-medium mb-4">Social Media & Web Presence (Optional)</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="websiteUrl">Website URL</Label>
              <Input
                id="websiteUrl"
                value={formData.websiteUrl}
                onChange={(e) => handleInputChange("websiteUrl", e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="facebookUrl">Facebook URL</Label>
              <Input
                id="facebookUrl"
                value={formData.facebookUrl}
                onChange={(e) => handleInputChange("facebookUrl", e.target.value)}
                placeholder="https://facebook.com/page"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="instagramUrl">Instagram URL</Label>
              <Input
                id="instagramUrl"
                value={formData.instagramUrl}
                onChange={(e) => handleInputChange("instagramUrl", e.target.value)}
                placeholder="https://instagram.com/handle"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
              <Input
                id="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={(e) => handleInputChange("linkedinUrl", e.target.value)}
                placeholder="https://linkedin.com/in/profile"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tiktokUrl">TikTok URL</Label>
              <Input
                id="tiktokUrl"
                value={formData.tiktokUrl}
                onChange={(e) => handleInputChange("tiktokUrl", e.target.value)}
                placeholder="https://tiktok.com/@handle"
              />
            </div>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Submitting Request..." : "Submit Provider Request"}
      </Button>
    </form>
  );
}
