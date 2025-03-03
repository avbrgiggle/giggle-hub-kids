
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SignupFormData } from "../hooks/useSignup";

interface MandatoryFieldsProps {
  formData: SignupFormData;
  onInputChange: (field: string, value: string) => void;
  disableEmail?: boolean;
}

export function MandatoryFields({ formData, onInputChange, disableEmail = false }: MandatoryFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name *</Label>
        <Input
          id="fullName"
          value={formData.fullName}
          onChange={(e) => onInputChange("fullName", e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="username">Username *</Label>
        <Input
          id="username"
          value={formData.username}
          onChange={(e) => onInputChange("username", e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => onInputChange("email", e.target.value)}
          required
          disabled={disableEmail}
          className={disableEmail ? "bg-muted cursor-not-allowed" : ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password *</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => onInputChange("password", e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number *</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => onInputChange("phone", e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Location (City/Postal Code) *</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => onInputChange("location", e.target.value)}
          required
        />
      </div>
    </>
  );
}
