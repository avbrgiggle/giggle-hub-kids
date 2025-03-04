
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Calendar, ClipboardList, Mail, AlertTriangle } from "lucide-react";
import { Student, Activity, StudentActivity } from "@/types/database.types";

const StudentManagement = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [student, setStudent] = useState<Partial<Student>>({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    parent_name: "",
    parent_email: "",
    parent_phone: "",
    emergency_contact: "",
    medical_notes: "",
    allergies: [],
    notes: ""
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [enrollments, setEnrollments] = useState<StudentActivity[]>([]);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchActivities();

    if (id) {
      fetchStudent();
      fetchEnrollments();
    }
  }, [id, user, navigate]);

  const fetchStudent = async () => {
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setStudent(data || {});
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

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("provider_id", user?.id)
        .eq("is_extracurricular", true)
        .order("title", { ascending: true });

      if (error) throw error;
      setActivities(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const fetchEnrollments = async () => {
    try {
      const { data, error } = await supabase
        .from("student_activities")
        .select(`
          *,
          activity:activities(*)
        `)
        .eq("student_id", id);

      if (error) throw error;
      setEnrollments(data || []);
      
      // Update selected activities
      setSelectedActivities(data.map(enrollment => enrollment.activity_id));
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setStudent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (!user) throw new Error("Not authenticated");

      if (!student.first_name || !student.last_name || !student.date_of_birth || 
          !student.parent_name || !student.parent_email || !student.parent_phone) {
        throw new Error("Please fill in all required fields");
      }

      const studentData = {
        provider_id: user.id,
        first_name: student.first_name,
        last_name: student.last_name,
        date_of_birth: student.date_of_birth,
        parent_name: student.parent_name,
        parent_email: student.parent_email,
        parent_phone: student.parent_phone,
        emergency_contact: student.emergency_contact,
        medical_notes: student.medical_notes,
        allergies: student.allergies || [],
        notes: student.notes
      };

      let studentId: string | undefined = id;
      
      if (id) {
        // Update existing student
        const { error } = await supabase
          .from("students")
          .update(studentData)
          .eq("id", id);

        if (error) throw error;
      } else {
        // Create new student
        const { data, error } = await supabase
          .from("students")
          .insert([studentData])
          .select();

        if (error) throw error;
        studentId = data?.[0]?.id;
      }

      toast({
        title: "Success",
        description: `Student ${id ? "updated" : "created"} successfully`,
      });
      
      if (!id && studentId) {
        // If we just created a new student, navigate to the student details page
        navigate(`/provider/students/${studentId}`);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSendPaymentReminder = () => {
    toast({
      title: "Payment Reminder",
      description: "Payment reminder functionality will be implemented soon.",
    });
  };

  if (loading && id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">
        {id ? `${student.first_name} ${student.last_name}` : "Add New Student"}
      </h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="details">Student Details</TabsTrigger>
          <TabsTrigger value="activities" disabled={!id}>Enrollments</TabsTrigger>
          <TabsTrigger value="payments" disabled={!id}>Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={student.first_name || ""}
                      onChange={(e) => handleInputChange("first_name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={student.last_name || ""}
                      onChange={(e) => handleInputChange("last_name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={student.date_of_birth?.split('T')[0] || ""}
                      onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Parent/Guardian Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="parentName">Parent/Guardian Name *</Label>
                    <Input
                      id="parentName"
                      value={student.parent_name || ""}
                      onChange={(e) => handleInputChange("parent_name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parentEmail">Parent Email *</Label>
                    <Input
                      id="parentEmail"
                      type="email"
                      value={student.parent_email || ""}
                      onChange={(e) => handleInputChange("parent_email", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parentPhone">Parent Phone *</Label>
                    <Input
                      id="parentPhone"
                      value={student.parent_phone || ""}
                      onChange={(e) => handleInputChange("parent_phone", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      value={student.emergency_contact || ""}
                      onChange={(e) => handleInputChange("emergency_contact", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Medical Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="allergies">Allergies (comma separated)</Label>
                    <Input
                      id="allergies"
                      value={student.allergies?.join(", ") || ""}
                      onChange={(e) => handleInputChange("allergies", e.target.value.split(",").map(item => item.trim()))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medicalNotes">Medical Notes</Label>
                    <Textarea
                      id="medicalNotes"
                      value={student.medical_notes || ""}
                      onChange={(e) => handleInputChange("medical_notes", e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={student.notes || ""}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    rows={3}
                    placeholder="Add any additional notes about the student..."
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/provider/dashboard?tab=students")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving
                  </>
                ) : id ? "Update Student" : "Create Student"}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="activities">
          {!id ? (
            <div className="text-center py-8">
              <p>Save student details first to manage enrollments</p>
            </div>
          ) : (
            <>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Current Enrollments</CardTitle>
                </CardHeader>
                <CardContent>
                  {enrollments.length === 0 ? (
                    <p className="text-muted-foreground">
                      This student is not enrolled in any activities yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {enrollments.map((enrollment) => (
                        <div key={enrollment.id} className="flex justify-between items-center border p-4 rounded-lg">
                          <div>
                            <h3 className="font-medium">{enrollment.activity?.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {enrollment.active ? 'Active' : 'Inactive'} • Payment Status: {enrollment.payment_status}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Calendar className="h-4 w-4 mr-2" />
                              Attendance
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleSendPaymentReminder}>
                              <Mail className="h-4 w-4 mr-2" />
                              Send Reminder
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Add to Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="activitySelect">Select Activity</Label>
                      <Select>
                        <SelectTrigger id="activitySelect">
                          <SelectValue placeholder="Select an activity" />
                        </SelectTrigger>
                        <SelectContent>
                          {activities.map((activity) => (
                            <SelectItem 
                              key={activity.id} 
                              value={activity.id}
                              disabled={selectedActivities.includes(activity.id)}
                            >
                              {activity.title} {selectedActivities.includes(activity.id) && "(Enrolled)"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button disabled={activities.length === 0 || activities.length === selectedActivities.length}>
                      Enroll Student
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="payments">
          {!id ? (
            <div className="text-center py-8">
              <p>Save student details first to manage payments</p>
            </div>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No payment history yet.</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>Payment Status</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <p className="mb-4">Payment functionality will be implemented soon.</p>
                    <Button onClick={handleSendPaymentReminder}>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Payment Reminder
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentManagement;
