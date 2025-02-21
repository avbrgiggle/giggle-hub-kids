
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface TermsAgreementProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function TermsAgreement({ checked, onCheckedChange }: TermsAgreementProps) {
  return (
    <div className="flex items-start space-x-2">
      <Checkbox
        id="terms"
        checked={checked}
        onCheckedChange={(checked) => onCheckedChange(checked as boolean)}
        required
      />
      <Label
        htmlFor="terms"
        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        I agree to the{" "}
        <Link to="/terms" className="text-primary hover:underline">
          Terms of Use
        </Link>
        ,{" "}
        <Link to="/privacy" className="text-primary hover:underline">
          Privacy Policy
        </Link>
        , and the use of cookies for a better browsing experience. By signing up,
        you confirm that you have read and understood our policies regarding data
        protection, account usage, and{" "}
        <Link to="/cookies" className="text-primary hover:underline">
          cookie preferences
        </Link>
        .
      </Label>
    </div>
  );
}
