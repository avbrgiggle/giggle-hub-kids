
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Student } from "@/types/database.types";
import { useEditStudentForm } from "./useEditStudentForm";
import BasicInfoSection from "./BasicInfoSection";
import ParentInfoSection from "./ParentInfoSection";
import AdditionalInfoSection from "./AdditionalInfoSection";

interface EditStudentFormProps {
  student: Student;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditStudentForm = ({ student, onSuccess, onCancel }: EditStudentFormProps) => {
  const { formData, date, loading, setDate, handleChange, handleSubmit } = useEditStudentForm(student, onSuccess);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Student</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <BasicInfoSection 
            formData={formData} 
            date={date} 
            setDate={setDate} 
            handleChange={handleChange} 
          />
          <ParentInfoSection 
            formData={formData} 
            handleChange={handleChange} 
          />
          <AdditionalInfoSection 
            formData={formData} 
            handleChange={handleChange} 
          />
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
