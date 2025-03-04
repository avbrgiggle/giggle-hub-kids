
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { PlusCircle, Loader2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Student } from "@/types/database.types";
import { Input } from "@/components/ui/input";

export default function StudentsTab() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user) {
      fetchStudents();
    }
  }, [user]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("provider_id", user?.id)
        .order("last_name", { ascending: true });

      if (error) throw error;
      
      setStudents(data || []);
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

  const filteredStudents = students.filter(student => {
    const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || student.parent_email.toLowerCase().includes(query);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Students</h2>
        <Button onClick={() => navigate("/provider/students/new")}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search students by name or parent email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {students.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground mb-4">
              You haven't added any students yet.
            </p>
            <Button onClick={() => navigate("/provider/students/new")}>
              Add Your First Student
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredStudents.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No students match your search.
            </p>
          ) : (
            filteredStudents.map((student) => (
              <StudentCard 
                key={student.id} 
                student={student} 
                onClick={() => navigate(`/provider/students/${student.id}`)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

interface StudentCardProps {
  student: Student;
  onClick: () => void;
}

function StudentCard({ student, onClick }: StudentCardProps) {
  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardContent className="flex items-center p-4">
        <div className="flex-1">
          <h3 className="font-medium">{student.first_name} {student.last_name}</h3>
          <p className="text-sm text-muted-foreground">Age: {calculateAge(student.date_of_birth)}</p>
        </div>
        <div className="flex-1">
          <p className="text-sm">Parent: {student.parent_name}</p>
          <p className="text-sm text-muted-foreground">{student.parent_email}</p>
        </div>
        <div className="flex-1 text-right">
          <Button variant="ghost" size="sm">View Details</Button>
        </div>
      </CardContent>
    </Card>
  );
}
