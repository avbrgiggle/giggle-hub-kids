
import React from "react";
import { Button } from "@/components/ui/button";
import { MandatoryFields } from "./MandatoryFields";
import { OptionalFields } from "./OptionalFields";
import { TermsAgreement } from "./TermsAgreement";
import { ProviderCodeInput } from "./ProviderCodeInput";
import type { SignupFormData } from "../hooks/useSignup";

interface ProviderSignupFormProps {
  formData: SignupFormData;
  loading: boolean;
  providerCodeValid: boolean;
  onInputChange: (field: string, value: string | boolean) => void;
  onValidCode: (isValid: boolean, email?: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export function ProviderSignupForm({ 
  formData, 
  loading, 
  providerCodeValid, 
  onInputChange, 
  onValidCode, 
  onSubmit 
}: ProviderSignupFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md mb-4">
        <p className="text-sm text-yellow-800">
          Provider accounts require a valid invitation code. If you don't have a code yet, 
          you can request provider access in the next tab.
        </p>
      </div>
      
      <ProviderCodeInput 
        code={formData.providerCode}
        onCodeChange={(code) => onInputChange("providerCode", code)}
        onValidCode={onValidCode}
      />
      
      {providerCodeValid && (
        <>
          <div className="space-y-4 mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <p className="text-sm text-muted-foreground">
                  Email address pre-filled from your invitation code.
                </p>
              </div>
              <MandatoryFields
                formData={{...formData, isProvider: true}}
                onInputChange={onInputChange}
                disableEmail={true}
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
            {loading ? "Creating Provider Account..." : "Create Provider Account"}
          </Button>
        </>
      )}
    </form>
  );
}
