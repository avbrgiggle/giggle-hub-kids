
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { useProviderCodeValidation } from "../hooks/useProviderCodeValidation";
import { CodeInputField } from "./provider-code/CodeInputField";
import { VerifyButton } from "./provider-code/VerifyButton";

interface ProviderCodeInputProps {
  code: string;
  onCodeChange: (code: string) => void;
  onValidCode: (isValid: boolean, email?: string) => void;
}

export function ProviderCodeInput({ code, onCodeChange, onValidCode }: ProviderCodeInputProps) {
  const { 
    validating, 
    isValid, 
    wasValidated, 
    validateCode, 
    setWasValidated, 
    setIsValid 
  } = useProviderCodeValidation(code, onValidCode);

  const handleCodeChange = (value: string) => {
    onCodeChange(value);
    if (wasValidated) {
      setWasValidated(false);
      setIsValid(false);
      onValidCode(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="providerCode">Provider Code</Label>
      <div className="flex space-x-2">
        <CodeInputField 
          code={code} 
          onCodeChange={handleCodeChange} 
          isValid={isValid} 
          wasValidated={wasValidated} 
        />
        <VerifyButton 
          validating={validating} 
          isValid={isValid} 
          wasValidated={wasValidated} 
          disabled={validating || !code} 
          onClick={validateCode} 
        />
      </div>
    </div>
  );
}
