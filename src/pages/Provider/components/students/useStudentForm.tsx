
import { useState } from "react";
import { Student } from "@/types/database.types";
import { addStudent } from "@/services/providerService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";

export const useStudentForm = (onSuccess: () => void) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Student>>({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    parent_name: "",
    parent_email: "",
    parent_phone: "",
    emergency_contact: "",
    medical_notes: "",
    allergies: [],
    notes: "",
  });
  const [date, setDate] = useState<Date | undefined>(undefined);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAllergyChange = (allergies: string[]) => {
    setFormData((prev) => ({ ...prev, allergies }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to add a student.",
        variant: "destructive",
      });
      return;
    }

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
      
      const newStudent = {
        ...formData,
        provider_id: user.id,
        date_of_birth: format(date, "yyyy-MM-dd"),
      } as Omit<Student, "id" | "created_at" | "updated_at">;
      
      await addStudent(newStudent);
      
      toast({
        title: "Success!",
        description: "Student has been added successfully.",
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error adding student:", error);
      toast({
        title: "Error",
        description: "Failed to add student. Please try again.",
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
