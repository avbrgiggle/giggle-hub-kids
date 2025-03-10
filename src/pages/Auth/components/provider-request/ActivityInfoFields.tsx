
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

interface ActivityInfoFieldsProps {
  formData: {
    activityTypes: string[];
    durationTypes: string[];
  };
  toggleActivityType: (type: string) => void;
  toggleDurationType: (type: string) => void;
}

const activityTypeOptions = [
  "Sports", "Arts & Crafts", "Music", "Dance", "STEM", "Languages", 
  "Cooking", "Outdoor Adventure", "Coding", "Robotics", "Theatre"
];

const durationTypeOptions = [
  "Weekends", "Holidays", "After School", "Summer Camps", "Year-Round"
];

export function ActivityInfoFields({ 
  formData, 
  toggleActivityType, 
  toggleDurationType 
}: ActivityInfoFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label>Activity Types *</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
          {activityTypeOptions.map((type) => (
            <Button
              key={type}
              type="button"
              variant={formData.activityTypes.includes(type) ? "default" : "outline"}
              className="justify-start"
              onClick={() => toggleActivityType(type)}
            >
              {formData.activityTypes.includes(type) ? (
                <Check className="mr-2 h-4 w-4" />
              ) : (
                <div className="w-4 mr-2" />
              )}
              {type}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Duration Types *</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
          {durationTypeOptions.map((type) => (
            <Button
              key={type}
              type="button"
              variant={formData.durationTypes.includes(type) ? "default" : "outline"}
              className="justify-start"
              onClick={() => toggleDurationType(type)}
            >
              {formData.durationTypes.includes(type) ? (
                <Check className="mr-2 h-4 w-4" />
              ) : (
                <div className="w-4 mr-2" />
              )}
              {type}
            </Button>
          ))}
        </div>
      </div>
    </>
  );
}
