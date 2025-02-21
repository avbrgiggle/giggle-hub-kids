
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SignupFormData } from "../hooks/useSignup";

interface OptionalFieldsProps {
  formData: SignupFormData;
  onInputChange: (field: string, value: string) => void;
}

export function OptionalFields({ formData, onInputChange }: OptionalFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="preferredCommunication">
          Preferred Communication Method
        </Label>
        <Select
          value={formData.preferredCommunication}
          onValueChange={(value) => onInputChange("preferredCommunication", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select preferred method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
            <SelectItem value="app">App Notifications</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="referralCode">Referral Code (Optional)</Label>
        <Input
          id="referralCode"
          value={formData.referralCode}
          onChange={(e) => onInputChange("referralCode", e.target.value)}
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="preferredPaymentMethod">
          Preferred Payment Method (Optional)
        </Label>
        <Select
          value={formData.preferredPaymentMethod}
          onValueChange={(value) => onInputChange("preferredPaymentMethod", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="credit_card">Credit Card</SelectItem>
            <SelectItem value="debit_card">Debit Card</SelectItem>
            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
