
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
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
          role: "parent",
        });

      if (profileError) throw profileError;

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
    handleInputChange,
    handleSubmit,
  };
};
