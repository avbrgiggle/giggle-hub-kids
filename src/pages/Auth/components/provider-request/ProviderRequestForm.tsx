
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { BasicInfoFields } from "./BasicInfoFields";
import { ActivityInfoFields } from "./ActivityInfoFields";
import { SocialMediaFields } from "./SocialMediaFields";
import { LogoUploadField } from "./LogoUploadField";
import { supabase } from "@/integrations/supabase/client";

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

  const handleLogoChange = (file: File | null) => {
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
        <BasicInfoFields 
          formData={formData}
          onInputChange={handleInputChange}
        />
        
        <ActivityInfoFields 
          formData={formData}
          toggleActivityType={toggleActivityType}
          toggleDurationType={toggleDurationType}
        />

        <LogoUploadField 
          logoPreview={logoPreview}
          onLogoChange={handleLogoChange}
        />

        <SocialMediaFields 
          formData={formData}
          onInputChange={handleInputChange}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Submitting Request..." : "Submit Provider Request"}
      </Button>
    </form>
  );
}
