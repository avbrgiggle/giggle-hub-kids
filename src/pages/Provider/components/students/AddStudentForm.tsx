
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useStudentForm } from "./useStudentForm";
import BasicInfoSection from "./BasicInfoSection";
import ParentInfoSection from "./ParentInfoSection";
import AdditionalInfoSection from "./AdditionalInfoSection";

interface AddStudentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddStudentForm = ({ onSuccess, onCancel }: AddStudentFormProps) => {
  const { formData, date, loading, setDate, handleChange, handleSubmit } = useStudentForm(onSuccess);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Student</CardTitle>
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
            {loading ? "Adding..." : "Add Student"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AddStudentForm;
