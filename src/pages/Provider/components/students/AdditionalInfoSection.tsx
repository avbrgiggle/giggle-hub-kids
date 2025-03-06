
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Student } from "@/types/database.types";

interface AdditionalInfoSectionProps {
  formData: Partial<Student>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const AdditionalInfoSection = ({ formData, handleChange }: AdditionalInfoSectionProps) => {
  return (
    <div className="border-t pt-4">
      <h3 className="text-lg font-medium mb-2">Additional Information</h3>
      <div className="space-y-2">
        <Label htmlFor="medical_notes">Medical Notes</Label>
        <Textarea
          id="medical_notes"
          name="medical_notes"
          placeholder="Allergies, medical conditions, etc."
          value={formData.medical_notes || ""}
          onChange={handleChange}
          rows={3}
        />
      </div>
      <div className="space-y-2 mt-4">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Any additional information"
          value={formData.notes || ""}
          onChange={handleChange}
          rows={3}
        />
      </div>
    </div>
  );
};

export default AdditionalInfoSection;
