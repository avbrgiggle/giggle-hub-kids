
import React from "react";
import { Button } from "@/components/ui/button";
import { MandatoryFields } from "./MandatoryFields";
import { OptionalFields } from "./OptionalFields";
import { TermsAgreement } from "./TermsAgreement";
import type { SignupFormData } from "../hooks/useSignup";

interface ParentSignupFormProps {
  formData: SignupFormData;
  loading: boolean;
  onInputChange: (field: string, value: string | boolean) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export function ParentSignupForm({ 
  formData, 
  loading, 
  onInputChange, 
  onSubmit 
}: ParentSignupFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <MandatoryFields
            formData={formData}
            onInputChange={onInputChange}
          />
          <OptionalFields
            formData={formData}
            onInputChange={onInputChange}
          />
        </div>
      </div>

      <div className="space-y-4">
        <TermsAgreement
          checked={formData.agreeToTerms}
          onCheckedChange={(checked) => onInputChange("agreeToTerms", checked)}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
}
