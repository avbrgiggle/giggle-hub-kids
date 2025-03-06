
import { useState } from "react";
import { Student } from "@/types/database.types";
import StudentList from "./components/StudentList";
import AddStudentForm from "./components/students/AddStudentForm";
import EditStudentForm from "./components/EditStudentForm";

export default function StudentsManagement() {
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const handleAddSuccess = () => {
    setView("list");
  };

  const handleEditSuccess = () => {
    setView("list");
    setSelectedStudent(null);
  };

  const handleStudentSelected = (student: Student) => {
    setSelectedStudent(student);
    setView("edit");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Student Management</h1>

      {view === "list" && (
        <StudentList 
          onAddClick={() => setView("add")} 
          onStudentSelected={handleStudentSelected}
        />
      )}

      {view === "add" && (
        <AddStudentForm 
          onSuccess={handleAddSuccess} 
          onCancel={() => setView("list")} 
        />
      )}

      {view === "edit" && selectedStudent && (
        <EditStudentForm
          student={selectedStudent}
          onSuccess={handleEditSuccess}
          onCancel={() => {
            setView("list");
            setSelectedStudent(null);
          }}
        />
      )}
    </div>
  );
}
