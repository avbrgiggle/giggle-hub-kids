
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BasicInfoFieldsProps {
  formData: {
    name: string;
    email: string;
    contactInfo: string;
    location: string;
    ageRange: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export function BasicInfoFields({ formData, onInputChange }: BasicInfoFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Provider Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onInputChange("name", e.target.value)}
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
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactInfo">Contact Information *</Label>
        <Textarea
          id="contactInfo"
          value={formData.contactInfo}
          onChange={(e) => onInputChange("contactInfo", e.target.value)}
          required
          placeholder="Phone number, preferred contact method, etc."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location *</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => onInputChange("location", e.target.value)}
          required
          placeholder="City, region or specific location"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ageRange">Age Range *</Label>
        <Input
          id="ageRange"
          value={formData.ageRange}
          onChange={(e) => onInputChange("ageRange", e.target.value)}
          required
          placeholder="e.g., 5-12 years"
        />
      </div>
    </>
  );
}
