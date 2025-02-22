
import { useState } from "react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Child } from "@/types/database.types";

export interface NewChild {
  first_name: string;
  last_name: string;
  date_of_birth: Date;
  interests: string[];
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
  });

  const fetchChildren = async () => {
    if (!userId) return;

    try {
      const { data: childrenData, error: childrenError } = await supabase
        .from("children")
        .select("*")
        .eq("parent_id", userId);

      if (childrenError) throw childrenError;
      setChildren(childrenData || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      const { error } = await supabase.from("children").insert({
        parent_id: userId,
        first_name: newChild.first_name,
        last_name: "",
        date_of_birth: format(newChild.date_of_birth, "yyyy-MM-dd"),
        interests: newChild.interests,
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
      });
      fetchChildren();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
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

  return {
    children,
    loading,
    showAddChild,
    newChild,
    setShowAddChild,
    setNewChild,
    handleAddChild,
    toggleInterest,
    fetchChildren,
  };
}
