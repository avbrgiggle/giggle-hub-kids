
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Child } from "@/types/database.types";

export interface NewChild {
  first_name: string;
  last_name: string;
  date_of_birth: Date;
  interests: string[];
  allergies?: string[];
  medical_conditions?: string;
  gender?: string;
}

export function useChildren(userId: string | undefined) {
  const { toast } = useToast();
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddChild, setShowAddChild] = useState(false);
  const [newChild, setNewChild] = useState<NewChild>({
    first_name: "",
    last_name: "",
    date_of_birth: new Date(),
    interests: [],
    allergies: [],
    medical_conditions: "",
    gender: ""
  });

  const fetchChildren = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data: childrenData, error: childrenError } = await supabase
        .from("children")
        .select("*")
        .eq("parent_id", userId);

      if (childrenError) {
        throw childrenError;
      }
      
      setChildren(childrenData || []);
    } catch (error: any) {
      console.error("Error fetching children:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load children",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to add a child",
      });
      return;
    }

    try {
      // Validate inputs
      if (!newChild.first_name.trim()) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Child name is required",
        });
        return;
      }

      const { error } = await supabase.from("children").insert({
        parent_id: userId,
        first_name: newChild.first_name.trim(),
        last_name: newChild.last_name.trim(),
        date_of_birth: format(newChild.date_of_birth, "yyyy-MM-dd"),
        interests: newChild.interests,
        allergies: newChild.allergies,
        medical_conditions: newChild.medical_conditions,
        gender: newChild.gender
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Child added successfully",
      });
      
      setShowAddChild(false);
      setNewChild({
        first_name: "",
        last_name: "",
        date_of_birth: new Date(),
        interests: [],
        allergies: [],
        medical_conditions: "",
        gender: ""
      });
      fetchChildren();
    } catch (error: any) {
      console.error("Error adding child:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add child",
      });
    }
  };

  const toggleInterest = (interest: string) => {
    setNewChild(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const toggleAllergy = (allergy: string) => {
    setNewChild(prev => ({
      ...prev,
      allergies: prev.allergies?.includes(allergy)
        ? prev.allergies.filter(a => a !== allergy)
        : [...(prev.allergies || []), allergy],
    }));
  };

  // Fetch children when component mounts or userId changes
  useEffect(() => {
    fetchChildren();
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    children,
    loading,
    showAddChild,
    newChild,
    setShowAddChild,
    setNewChild,
    handleAddChild,
    toggleInterest,
    toggleAllergy,
    fetchChildren,
  };
}
