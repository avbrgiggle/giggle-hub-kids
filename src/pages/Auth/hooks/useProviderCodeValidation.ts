
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProviderSignupCode } from "@/types/database.types";

export function useProviderCodeValidation(
  code: string,
  onValidCode: (isValid: boolean, email?: string) => void
) {
  const { toast } = useToast();
  const [validating, setValidating] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [wasValidated, setWasValidated] = useState(false);

  const validateCode = async () => {
    if (!code || code.length < 6) {
      toast({
        variant: "destructive",
        title: "Invalid code",
        description: "Please enter a valid provider code",
      });
      return;
    }

    setValidating(true);
    setWasValidated(false);
    
    try {
      const { data, error } = await supabase
        .from("provider_signup_codes")
        .select("*")
        .eq("code", code)
        .eq("used", false)
        .single();

      if (error) throw error;

      const providerCode = data as ProviderSignupCode;

      if (!providerCode) {
        setIsValid(false);
        onValidCode(false);
        toast({
          variant: "destructive",
          title: "Invalid code",
          description: "The provider code is invalid or has already been used",
        });
      } else {
        // Check if code is expired
        if (new Date(providerCode.expires_at) < new Date()) {
          setIsValid(false);
          onValidCode(false);
          toast({
            variant: "destructive",
            title: "Expired code",
            description: "This provider code has expired",
          });
        } else {
          setIsValid(true);
          onValidCode(true, providerCode.email);
          toast({
            title: "Code verified",
            description: "Provider code is valid",
          });
        }
      }
    } catch (error: any) {
      setIsValid(false);
      onValidCode(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to validate code",
      });
    } finally {
      setValidating(false);
      setWasValidated(true);
    }
  };

  return { validating, isValid, wasValidated, validateCode, setWasValidated, setIsValid };
}
