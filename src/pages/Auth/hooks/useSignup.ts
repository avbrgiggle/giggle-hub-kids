
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface SignupFormData {
  fullName: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  location: string;
  preferredCommunication: string;
  referralCode: string;
  preferredPaymentMethod: string;
  agreeToTerms: boolean;
  providerCode: string;
  isProvider: boolean;
}

export const useSignup = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    fullName: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    location: "",
    preferredCommunication: "email",
    referralCode: "",
    preferredPaymentMethod: "",
    agreeToTerms: false,
    providerCode: "",
    isProvider: false,
  });
  const [loading, setLoading] = useState(false);
  const [providerCodeValid, setProviderCodeValid] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleValidProviderCode = (isValid: boolean, email?: string) => {
    setProviderCodeValid(isValid);
    if (isValid && email) {
      setFormData((prev) => ({
        ...prev,
        email: email,
        isProvider: true,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeToTerms) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please agree to the terms and conditions",
      });
      return;
    }

    // If provider is selected but code is not valid
    if (formData.isProvider && !providerCodeValid) {
      toast({
        variant: "destructive",
        title: "Invalid provider code",
        description: "Please enter and verify a valid provider code",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
        },
      });

      if (signUpError) throw signUpError;
      
      if (!signUpData.user?.id) {
        throw new Error("User ID not found after signup");
      }

      // Insert profile data
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: signUpData.user.id,
          full_name: formData.fullName,
          username: formData.username,
          phone: formData.phone,
          location: formData.location,
          preferred_communication: formData.preferredCommunication,
          referral_code: formData.referralCode || null,
          preferred_payment_method: formData.preferredPaymentMethod || null,
          role: formData.isProvider ? "provider" : "parent",
        });

      if (profileError) throw profileError;

      // If this is a provider signup, mark the code as used
      if (formData.isProvider && formData.providerCode) {
        const { error: codeError } = await supabase
          .from("provider_signup_codes")
          .update({ used: true })
          .eq("code", formData.providerCode);

        if (codeError) {
          console.error("Error marking code as used:", codeError);
          // We don't want to fail the signup if this fails
        }
      }

      toast({
        title: "Success",
        description: "Your account has been created successfully",
      });
      navigate("/");
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

  return {
    formData,
    loading,
    providerCodeValid,
    handleInputChange,
    handleValidProviderCode,
    handleSubmit,
  };
};
