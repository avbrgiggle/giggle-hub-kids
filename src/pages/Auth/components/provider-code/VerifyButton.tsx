
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";

interface VerifyButtonProps {
  validating: boolean;
  isValid: boolean;
  wasValidated: boolean;
  disabled: boolean;
  onClick: () => void;
}

export function VerifyButton({ validating, isValid, wasValidated, disabled, onClick }: VerifyButtonProps) {
  return (
    <Button 
      type="button" 
      onClick={onClick} 
      disabled={disabled} 
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
  );
}
