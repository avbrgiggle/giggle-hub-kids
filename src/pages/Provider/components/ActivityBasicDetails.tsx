
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Activity } from "@/types/database.types";

interface ActivityBasicDetailsProps {
  activity: Partial<Activity>;
  setActivity: (value: React.SetStateAction<Partial<Activity>>) => void;
}

const ActivityBasicDetails = ({ activity, setActivity }: ActivityBasicDetailsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={activity.title || ""}
          onChange={(e) =>
            setActivity((prev) => ({ ...prev, title: e.target.value }))
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={activity.description || ""}
          onChange={(e) =>
            setActivity((prev) => ({ ...prev, description: e.target.value }))
          }
          required
          rows={4}
        />
      </div>
    </>
  );
};

export default ActivityBasicDetails;
