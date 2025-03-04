
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Student } from "@/types/database.types";
import { updateStudent } from "@/services/providerService";
import { toast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditStudentFormProps {
  student: Student;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditStudentForm = ({ student, onSuccess, onCancel }: EditStudentFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Student>>({
    first_name: "",
    last_name: "",
    parent_name: "",
    parent_email: "",
    parent_phone: "",
    emergency_contact: "",
    medical_notes: "",
    notes: "",
  });
  const [date, setDate] = useState<Date>();

  useEffect(() => {
    if (student) {
      setFormData({
        first_name: student.first_name,
        last_name: student.last_name,
        parent_name: student.parent_name,
        parent_email: student.parent_email,
        parent_phone: student.parent_phone,
        emergency_contact: student.emergency_contact || "",
        medical_notes: student.medical_notes || "",
        notes: student.notes || "",
      });
      
      if (student.date_of_birth) {
        setDate(new Date(student.date_of_birth));
      }
    }
  }, [student]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.first_name || !formData.last_name || !date || !formData.parent_name || !formData.parent_email || !formData.parent_phone) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const updatedStudent = {
        ...formData,
        date_of_birth: format(date, "yyyy-MM-dd"),
      };
      
      await updateStudent(student.id, updatedStudent);
      
      toast({
        title: "Success!",
        description: "Student has been updated successfully.",
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error updating student:", error);
      toast({
        title: "Error",
        description: "Failed to update student. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Student</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                name="first_name"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                name="last_name"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date of Birth *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

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
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onCancel} type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default EditStudentForm;
