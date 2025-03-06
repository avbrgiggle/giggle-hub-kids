
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Student } from "@/types/database.types";

interface ParentInfoSectionProps {
  formData: Partial<Student>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ParentInfoSection = ({ formData, handleChange }: ParentInfoSectionProps) => {
  return (
    <div className="border-t pt-4">
      <h3 className="text-lg font-medium mb-2">Parent/Guardian Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="parent_name">Parent/Guardian Name *</Label>
          <Input
            id="parent_name"
            name="parent_name"
            placeholder="Full Name"
            value={formData.parent_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="parent_email">Parent/Guardian Email *</Label>
          <Input
            id="parent_email"
            name="parent_email"
            type="email"
            placeholder="Email Address"
            value={formData.parent_email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="parent_phone">Parent/Guardian Phone *</Label>
          <Input
            id="parent_phone"
            name="parent_phone"
            placeholder="Phone Number"
            value={formData.parent_phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emergency_contact">Emergency Contact</Label>
          <Input
            id="emergency_contact"
            name="emergency_contact"
            placeholder="Emergency Contact"
            value={formData.emergency_contact}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ParentInfoSection;
