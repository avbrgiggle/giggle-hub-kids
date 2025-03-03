
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity } from "@/types/database.types";

interface ActivityDetailsFieldsProps {
  activity: Partial<Activity>;
  setActivity: (value: React.SetStateAction<Partial<Activity>>) => void;
}

const ActivityDetailsFields = ({ activity, setActivity }: ActivityDetailsFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={activity.location || ""}
          onChange={(e) =>
            setActivity((prev) => ({ ...prev, location: e.target.value }))
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={activity.category || ""}
          onChange={(e) =>
            setActivity((prev) => ({ ...prev, category: e.target.value }))
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="age_range">Age Range</Label>
        <Input
          id="age_range"
          value={activity.age_range || ""}
          onChange={(e) =>
            setActivity((prev) => ({ ...prev, age_range: e.target.value }))
          }
          placeholder="e.g., 5-12"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="capacity">Capacity</Label>
        <Input
          id="capacity"
          type="number"
          value={activity.capacity || ""}
          onChange={(e) =>
            setActivity((prev) => ({
              ...prev,
              capacity: parseInt(e.target.value),
            }))
          }
          required
          min={1}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          value={activity.price || ""}
          onChange={(e) =>
            setActivity((prev) => ({
              ...prev,
              price: parseFloat(e.target.value),
            }))
          }
          required
          min={0}
          step={0.01}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">Duration</Label>
        <Input
          id="duration"
          value={activity.duration || ""}
          onChange={(e) =>
            setActivity((prev) => ({ ...prev, duration: e.target.value }))
          }
          placeholder="e.g., 1 hour"
          required
        />
      </div>
    </div>
  );
};

export default ActivityDetailsFields;
