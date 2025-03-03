
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Check, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ProviderCodeInputProps {
  code: string;
  onCodeChange: (code: string) => void;
  onValidCode: (isValid: boolean, email?: string) => void;
}

export function ProviderCodeInput({ code, onCodeChange, onValidCode }: ProviderCodeInputProps) {
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

      if (!data) {
        setIsValid(false);
        onValidCode(false);
        toast({
          variant: "destructive",
          title: "Invalid code",
          description: "The provider code is invalid or has already been used",
        });
      } else {
        // Check if code is expired
        if (new Date(data.expires_at) < new Date()) {
          setIsValid(false);
          onValidCode(false);
          toast({
            variant: "destructive",
            title: "Expired code",
            description: "This provider code has expired",
          });
        } else {
          setIsValid(true);
          onValidCode(true, data.email);
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

  return (
    <div className="space-y-2">
      <Label htmlFor="providerCode">Provider Code</Label>
      <div className="flex space-x-2">
        <Input
          id="providerCode"
          value={code}
          onChange={(e) => {
            onCodeChange(e.target.value);
            if (wasValidated) {
              setWasValidated(false);
              setIsValid(false);
              onValidCode(false);
            }
          }}
          placeholder="Enter your provider code"
          className={wasValidated ? (isValid ? "border-green-500" : "border-red-500") : ""}
        />
        <Button 
          type="button" 
          onClick={validateCode} 
          disabled={validating || !code} 
          variant="outline"
        >
          {validating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : wasValidated && isValid ? (
            <Check className="h-4 w-4" />
          ) : (
            "Verify"
          )}
        </Button>
      </div>
    </div>
  );
}
