
import { Input } from "@/components/ui/input";

interface CodeInputFieldProps {
  code: string;
  onCodeChange: (code: string) => void;
  isValid: boolean;
  wasValidated: boolean;
}

export function CodeInputField({ code, onCodeChange, isValid, wasValidated }: CodeInputFieldProps) {
  return (
    <Input
      id="providerCode"
      value={code}
      onChange={(e) => onCodeChange(e.target.value)}
      placeholder="Enter your provider code"
      className={wasValidated ? (isValid ? "border-green-500" : "border-red-500") : ""}
    />
  );
}
