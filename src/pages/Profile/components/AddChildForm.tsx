
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { NewChild } from "../hooks/useChildren";

const interests = [
  "Sports",
  "Arts",
  "STEM",
  "Music",
  "Dance",
  "Languages",
  "Cooking",
  "Nature",
];

interface AddChildFormProps {
  newChild: NewChild;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onNewChildChange: (field: keyof NewChild, value: any) => void;
  onToggleInterest: (interest: string) => void;
}

export function AddChildForm({
  newChild,
  onSubmit,
  onCancel,
  onNewChildChange,
  onToggleInterest,
}: AddChildFormProps) {
  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">Child's First Name</Label>
          <Input
            id="first_name"
            value={newChild.first_name}
            onChange={(e) => onNewChildChange("first_name", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Date of Birth</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(newChild.date_of_birth, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={newChild.date_of_birth}
                onSelect={(date) => onNewChildChange("date_of_birth", date || new Date())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label>Interests</Label>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest) => (
              <Button
                key={interest}
                type="button"
                variant={newChild.interests.includes(interest) ? "default" : "outline"}
                className="text-sm"
                onClick={() => onToggleInterest(interest)}
              >
                {interest}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Child</Button>
      </div>
    </form>
  );
}
