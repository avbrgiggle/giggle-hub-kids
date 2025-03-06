
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Loader2, Calendar as CalendarIcon, User, Check, X, Clock } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { AttendanceRecord, Student, StudentActivity } from "@/types/database.types";
import { getAttendanceRecords, addAttendanceRecord, updateAttendanceRecord } from "@/services/attendanceService";

export default function AttendanceTracking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedActivity, setSelectedActivity] = useState<string>("");
  const [activities, setActivities] = useState<any[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [studentActivities, setStudentActivities] = useState<StudentActivity[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [attendanceNotes, setAttendanceNotes] = useState<Record<string, string>>({});
  const [tab, setTab] = useState("daily");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    loadActivities();
  }, [user, navigate]);

  useEffect(() => {
    if (selectedActivity && selectedDate) {
      loadAttendanceData();
    }
  }, [selectedActivity, selectedDate]);

  const loadActivities = async () => {
    try {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("provider_id", user?.id)
        .order("title", { ascending: true });

      if (error) throw error;

      setActivities(data || []);
      if (data && data.length > 0) {
        setSelectedActivity(data[0].id);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load activities",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAttendanceData = async () => {
    setLoading(true);
    try {
      // Get all enrolled students for this activity
      const { data: enrolledData, error: enrolledError } = await supabase
        .from("student_activities")
        .select(`
          *,
          student:student_id(*)
        `)
        .eq("activity_id", selectedActivity)
        .eq("active", true);

      if (enrolledError) throw enrolledError;

      const studentActivitiesData = enrolledData || [];
      setStudentActivities(studentActivitiesData);

      // Extract the student objects
      const studentsData = studentActivitiesData
        .map((sa: any) => sa.student)
        .filter(Boolean);
      setStudents(studentsData);

      // Get attendance records for this date and these student activities
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const studentActivityIds = studentActivitiesData.map((sa: any) => sa.id);

      if (studentActivityIds.length > 0) {
        const records = await getAttendanceRecords(studentActivityIds, formattedDate);
        setAttendanceRecords(records);

        // Set notes for each record
        const notes: Record<string, string> = {};
        records.forEach((record) => {
          notes[record.student_activity_id] = record.notes || "";
        });
        setAttendanceNotes(notes);
      } else {
        setAttendanceRecords([]);
        setAttendanceNotes({});
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load attendance data",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusForStudent = (studentActivityId: string): 'present' | 'absent' | 'late' | 'excused' | null => {
    const record = attendanceRecords.find(
      (rec) => rec.student_activity_id === studentActivityId
    );
    return record ? record.status as 'present' | 'absent' | 'late' | 'excused' : null;
  };

  const handleStatusChange = async (
    studentActivityId: string,
    status: 'present' | 'absent' | 'late' | 'excused'
  ) => {
    setSavingAttendance(true);

    try {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const existingRecord = attendanceRecords.find(
        (rec) => rec.student_activity_id === studentActivityId
      );

      if (existingRecord) {
        // Update existing record
        const updatedRecord = await updateAttendanceRecord(
          existingRecord.id,
          {
            status,
            notes: attendanceNotes[studentActivityId] || ""
          }
        );

        setAttendanceRecords((prev) =>
          prev.map((rec) =>
            rec.id === updatedRecord.id ? updatedRecord : rec
          )
        );
      } else {
        // Create new record
        const newRecord = await addAttendanceRecord({
          student_activity_id: studentActivityId,
          date: formattedDate,
          status,
          notes: attendanceNotes[studentActivityId] || ""
        });

        setAttendanceRecords((prev) => [...prev, newRecord]);
      }

      toast({
        title: "Attendance updated",
        description: "Student attendance has been recorded",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update attendance",
      });
    } finally {
      setSavingAttendance(false);
    }
  };

  const handleNoteChange = (studentActivityId: string, note: string) => {
    setAttendanceNotes((prev) => ({
      ...prev,
      [studentActivityId]: note,
    }));
  };

  const handleSaveNotes = async (studentActivityId: string) => {
    setSavingAttendance(true);

    try {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const existingRecord = attendanceRecords.find(
        (rec) => rec.student_activity_id === studentActivityId
      );

      if (existingRecord) {
        // Update existing record
        const updatedRecord = await updateAttendanceRecord(
          existingRecord.id,
          {
            notes: attendanceNotes[studentActivityId] || ""
          }
        );

        setAttendanceRecords((prev) =>
          prev.map((rec) =>
            rec.id === updatedRecord.id ? updatedRecord : rec
          )
        );

        toast({
          title: "Notes saved",
          description: "Attendance notes have been updated",
        });
      } else {
        // If there's no status set yet, we'll default to 'present' and save the note
        const newRecord = await addAttendanceRecord({
          student_activity_id: studentActivityId,
          date: formattedDate,
          status: 'present',
          notes: attendanceNotes[studentActivityId] || ""
        });

        setAttendanceRecords((prev) => [...prev, newRecord]);

        toast({
          title: "Notes saved",
          description: "Attendance and notes have been recorded",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save notes",
      });
    } finally {
      setSavingAttendance(false);
    }
  };

  const getStudentActivityForStudent = (studentId: string) => {
    return studentActivities.find((sa) => sa.student_id === studentId);
  };

  if (loading && !activities.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Attendance Tracking</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Select Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedActivity} onValueChange={setSelectedActivity}>
              <SelectTrigger>
                <SelectValue placeholder="Select an activity" />
              </SelectTrigger>
              <SelectContent>
                {activities.map((activity) => (
                  <SelectItem key={activity.id} value={activity.id}>
                    {activity.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border mx-auto"
            />
          </CardContent>
        </Card>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="daily">Daily Attendance</TabsTrigger>
          <TabsTrigger value="reports">Attendance Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="daily">
          {students.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                ) : (
                  "No students enrolled in this activity"
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h2 className="font-semibold flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                  Attendance for {format(selectedDate, "EEEE, MMMM d, yyyy")}
                </h2>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Present</TableHead>
                      <TableHead>Absent</TableHead>
                      <TableHead>Late</TableHead>
                      <TableHead>Excused</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                        </TableCell>
                      </TableRow>
                    ) : (
                      students.map((student) => {
                        const studentActivity = getStudentActivityForStudent(student.id);
                        if (!studentActivity) return null;

                        const status = getStatusForStudent(studentActivity.id);

                        return (
                          <TableRow key={student.id}>
                            <TableCell>
                              <div className="flex items-center">
                                <User className="h-5 w-5 mr-2 text-muted-foreground" />
                                <div>
                                  <div className="font-medium">
                                    {student.first_name} {student.last_name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {student.parent_name}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant={status === "present" ? "default" : "outline"}
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handleStatusChange(studentActivity.id, "present")}
                                disabled={savingAttendance}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant={status === "absent" ? "default" : "outline"}
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handleStatusChange(studentActivity.id, "absent")}
                                disabled={savingAttendance}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant={status === "late" ? "default" : "outline"}
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handleStatusChange(studentActivity.id, "late")}
                                disabled={savingAttendance}
                              >
                                <Clock className="h-4 w-4" />
                              </Button>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant={status === "excused" ? "default" : "outline"}
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handleStatusChange(studentActivity.id, "excused")}
                                disabled={savingAttendance}
                              >
                                <span className="text-xs">E</span>
                              </Button>
                            </TableCell>
                            <TableCell className="w-64">
                              <div className="flex items-center gap-2">
                                <Input
                                  placeholder="Add notes..."
                                  value={attendanceNotes[studentActivity.id] || ""}
                                  onChange={(e) =>
                                    handleNoteChange(studentActivity.id, e.target.value)
                                  }
                                  className="h-8 text-sm"
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8"
                                  onClick={() => handleSaveNotes(studentActivity.id)}
                                  disabled={savingAttendance}
                                >
                                  Save
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                View and export attendance reports over time. Filter by date range, student, or activity.
              </p>
              
              {/* Report generation form would go here */}
              <div className="text-center py-8">
                <p>Report functionality coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
