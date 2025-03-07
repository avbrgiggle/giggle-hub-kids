
import { useState, useEffect } from "react";
import { Student } from "@/types/database.types";
import { updateStudent } from "@/services/studentService";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";

export const useEditStudentForm = (student: Student, onSuccess: () => void) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Student>>({
    first_name: "",
    last_name: "",
    parent_name: "",
    parent_email: "",
    parent_phone: "",
    emergency_contact: "",
    medical_notes: "",
    allergies: [],
    notes: "",
  });
  const [date, setDate] = useState<Date | undefined>(undefined);

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
        allergies: student.allergies || [],
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

  const handleAllergyChange = (allergies: string[]) => {
    setFormData((prev) => ({ ...prev, allergies }));
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

  return {
    formData,
    date,
    loading,
    setDate,
    handleChange,
    handleAllergyChange,
    handleSubmit
  };
};
