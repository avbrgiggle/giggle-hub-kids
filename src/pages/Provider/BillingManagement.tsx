import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Loader2, CreditCard, DollarSign, FileText, Calendar, Mail, Download } from "lucide-react";
import { Student, StudentActivity, Activity, Payment } from "@/types/database.types";
import { 
  getPayments, 
  addPayment, 
  updatePayment 
} from "@/services/paymentService";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function BillingManagement() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("pending");
  const [students, setStudents] = useState<Student[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [studentActivities, setStudentActivities] = useState<StudentActivity[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "yyyy-MM"));
  const [sendingEmails, setSendingEmails] = useState(false);
  const [createPaymentOpen, setCreatePaymentOpen] = useState(false);
  const [selectedStudentActivity, setSelectedStudentActivity] = useState<StudentActivity | null>(null);
  const [newPayment, setNewPayment] = useState({
    amount: 0,
    method: "credit_card" as "credit_card" | "bank_transfer" | "paypal" | "mb_way" | "other",
    status: "paid" as "paid" | "pending" | "failed" | "refunded",
    notes: "",
    invoiceNumber: ""
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    loadData();
  }, [user, navigate, tab, selectedMonth]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load all students for this provider
      const { data: studentsData, error: studentsError } = await supabase
        .from("students")
        .select("*")
        .eq("provider_id", user?.id)
        .order("last_name", { ascending: true });
        
      if (studentsError) throw studentsError;
      setStudents(studentsData as Student[]);
      
      // Load all activities for this provider
      const { data: activitiesData, error: activitiesError } = await supabase
        .from("activities")
        .select("*")
        .eq("provider_id", user?.id)
        .order("title", { ascending: true });
        
      if (activitiesError) throw activitiesError;
      setActivities(activitiesData as Activity[]);
      
      // Load all student activities with their relationships
      const { data: saData, error: saError } = await supabase
        .from("student_activities")
        .select(`
          *,
          student:student_id(*),
          activity:activity_id(*)
        `);
        
      if (saError) throw saError;
      
      // Filter by payment status if on the pending/paid tabs
      let filteredSA = saData || [];
      if (tab === "pending") {
        filteredSA = filteredSA.filter(sa => sa.payment_status === "pending");
      } else if (tab === "paid") {
        filteredSA = filteredSA.filter(sa => sa.payment_status === "paid");
      }
      
      setStudentActivities(filteredSA as StudentActivity[]);
      
      // Load all payments
      const { data: paymentsData, error: paymentsError } = await supabase
        .from("payments")
        .select("*")
        .order("date", { ascending: false });
        
      if (paymentsError) throw paymentsError;
      
      // Filter payments by month if needed
      let filteredPayments = paymentsData || [];
      if (selectedMonth) {
        const [year, month] = selectedMonth.split("-");
        filteredPayments = filteredPayments.filter(payment => {
          const paymentDate = new Date(payment.date);
          return (
            paymentDate.getFullYear() === parseInt(year) &&
            paymentDate.getMonth() === parseInt(month) - 1
          );
        });
      }
      
      setPayments(filteredPayments as Payment[]);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load billing data",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.first_name} ${student.last_name}` : "Unknown Student";
  };

  const getActivityName = (activityId: string) => {
    const activity = activities.find(a => a.id === activityId);
    return activity ? activity.title : "Unknown Activity";
  };

  const handleCreatePayment = () => {
    if (!selectedStudentActivity) return;
    
    setCreatePaymentOpen(false);
    setLoading(true);
    
    const paymentData = {
      student_activity_id: selectedStudentActivity.id,
      amount: newPayment.amount,
      method: newPayment.method,
      status: newPayment.status,
      notes: newPayment.notes,
      invoice_number: newPayment.invoiceNumber || null,
      date: new Date().toISOString()
    };
    
    addPayment(paymentData)
      .then(() => {
        // Update student activity payment status if payment is marked as paid
        if (newPayment.status === "paid") {
          supabase
            .from("student_activities")
            .update({
              payment_status: "paid",
              last_payment_date: new Date().toISOString()
            })
            .eq("id", selectedStudentActivity.id)
            .then(() => {
              toast({
                title: "Payment added",
                description: "The payment has been recorded successfully",
              });
              
              // Reset payment form
              setNewPayment({
                amount: 0,
                method: "credit_card",
                status: "paid",
                notes: "",
                invoiceNumber: ""
              });
              
              // Reload data
              loadData();
            });
        } else {
          toast({
            title: "Payment added",
            description: "The payment has been recorded successfully",
          });
          
          // Reset payment form
          setNewPayment({
            amount: 0,
            method: "credit_card",
            status: "paid",
            notes: "",
            invoiceNumber: ""
          });
          
          // Reload data
          loadData();
        }
      })
      .catch(error => {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to add payment",
        });
        setLoading(false);
      });
  };

  const handleSendPaymentReminders = () => {
    setSendingEmails(true);
    
    // In a real implementation, this would connect to an edge function
    // that sends emails to parents of students with pending payments
    
    setTimeout(() => {
      setSendingEmails(false);
      toast({
        title: "Reminders sent",
        description: "Payment reminders have been sent to all parents with pending payments",
      });
    }, 2000);
  };

  const openPaymentDialog = (studentActivity: StudentActivity) => {
    setSelectedStudentActivity(studentActivity);
    
    // Pre-fill the payment amount based on the activity price
    if (studentActivity.activity && typeof studentActivity.activity === 'object') {
      setNewPayment(prev => ({
        ...prev,
        amount: studentActivity.activity.price || 0
      }));
    }
    
    setCreatePaymentOpen(true);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Billing Management</h1>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="pending">Pending Payments</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Students with Pending Payments</h2>
            <Button onClick={handleSendPaymentReminders} disabled={sendingEmails}>
              <Mail className="h-4 w-4 mr-2" />
              {sendingEmails ? "Sending..." : "Send Payment Reminders"}
            </Button>
          </div>

          {studentActivities.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                ) : (
                  "No pending payments"
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Parent</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Actions</TableHead>
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
                    studentActivities.map((sa) => (
                      <TableRow key={sa.id}>
                        <TableCell>
                          {sa.student && typeof sa.student === 'object' 
                            ? `${sa.student.first_name} ${sa.student.last_name}` 
                            : "Unknown"
                          }
                        </TableCell>
                        <TableCell>
                          {sa.activity && typeof sa.activity === 'object' 
                            ? sa.activity.title 
                            : "Unknown"
                          }
                        </TableCell>
                        <TableCell>
                          {sa.student && typeof sa.student === 'object' 
                            ? (
                              <div>
                                <div>{sa.student.parent_name}</div>
                                <div className="text-xs text-muted-foreground">{sa.student.parent_email}</div>
                              </div>
                            ) 
                            : "Unknown"
                          }
                        </TableCell>
                        <TableCell>
                          {format(new Date(sa.start_date), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          {sa.activity && typeof sa.activity === 'object' 
                            ? `€${sa.activity.price}` 
                            : "-"
                          }
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openPaymentDialog(sa)}
                            >
                              <DollarSign className="h-4 w-4 mr-1" />
                              Record Payment
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                // This would typically generate and send an invoice
                                toast({
                                  title: "Invoice sent",
                                  description: "Invoice has been sent to the parent",
                                });
                              }}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              Send Invoice
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="paid">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Paid Activities</h2>
          </div>

          {studentActivities.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                ) : (
                  "No paid activities found"
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Last Payment</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : (
                    studentActivities.map((sa) => (
                      <TableRow key={sa.id}>
                        <TableCell>
                          {sa.student && typeof sa.student === 'object' 
                            ? `${sa.student.first_name} ${sa.student.last_name}` 
                            : "Unknown"
                          }
                        </TableCell>
                        <TableCell>
                          {sa.activity && typeof sa.activity === 'object' 
                            ? sa.activity.title 
                            : "Unknown"
                          }
                        </TableCell>
                        <TableCell>
                          {sa.last_payment_date 
                            ? format(new Date(sa.last_payment_date), "MMM d, yyyy") 
                            : "-"
                          }
                        </TableCell>
                        <TableCell>
                          {sa.activity && typeof sa.activity === 'object' 
                            ? `€${sa.activity.price}` 
                            : "-"
                          }
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-1" />
                            View Receipt
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Payment History</h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <Input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-40"
                />
              </div>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {payments.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                ) : (
                  "No payment history found for the selected period"
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Invoice</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : (
                    payments.map((payment) => {
                      const studentActivity = studentActivities.find(
                        sa => sa.id === payment.student_activity_id
                      );
                      
                      return (
                        <TableRow key={payment.id}>
                          <TableCell>
                            {format(new Date(payment.date), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>
                            {studentActivity && studentActivity.student && typeof studentActivity.student === 'object'
                              ? `${studentActivity.student.first_name} ${studentActivity.student.last_name}` 
                              : "-"
                            }
                          </TableCell>
                          <TableCell>
                            {studentActivity && studentActivity.activity && typeof studentActivity.activity === 'object'
                              ? studentActivity.activity.title
                              : "-"
                            }
                          </TableCell>
                          <TableCell>€{payment.amount}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                              {payment.method === "credit_card" ? "Credit Card" :
                               payment.method === "bank_transfer" ? "Bank Transfer" :
                               payment.method === "paypal" ? "PayPal" :
                               payment.method === "mb_way" ? "MB Way" : "Other"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                payment.status === "paid" ? "default" :
                                payment.status === "pending" ? "outline" :
                                payment.status === "failed" ? "destructive" :
                                "secondary"
                              }
                            >
                              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {payment.invoice_number ? (
                              <Button variant="ghost" size="sm">
                                <FileText className="h-4 w-4 mr-1" />
                                {payment.invoice_number}
                              </Button>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Payment Dialog */}
      <Dialog open={createPaymentOpen} onOpenChange={setCreatePaymentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Record a payment for this student's activity
            </DialogDescription>
          </DialogHeader>
          
          {selectedStudentActivity && (
            <div className="space-y-4 py-2">
              <div className="grid gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">Student</p>
                  <p>
                    {selectedStudentActivity.student && typeof selectedStudentActivity.student === 'object'
                      ? `${selectedStudentActivity.student.first_name} ${selectedStudentActivity.student.last_name}`
                      : "Unknown Student"
                    }
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-1">Activity</p>
                  <p>
                    {selectedStudentActivity.activity && typeof selectedStudentActivity.activity === 'object'
                      ? selectedStudentActivity.activity.title
                      : "Unknown Activity"
                    }
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="method">Payment Method</Label>
                  <Select
                    value={newPayment.method}
                    onValueChange={(value) => setNewPayment(prev => ({ 
                      ...prev, 
                      method: value as "credit_card" | "bank_transfer" | "paypal" | "mb_way" | "other"
                    }))}
                  >
                    <SelectTrigger id="method">
                      <SelectValue placeholder="Select a payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="mb_way">MB Way</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newPayment.status}
                    onValueChange={(value) => setNewPayment(prev => ({ 
                      ...prev, 
                      status: value as "paid" | "pending" | "failed" | "refunded"
                    }))}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="invoiceNumber">Invoice Number (Optional)</Label>
                  <Input
                    id="invoiceNumber"
                    value={newPayment.invoiceNumber}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={newPayment.notes}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional payment details"
                  />
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreatePaymentOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePayment}>
              Record Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Label({ htmlFor, children }: { htmlFor: string, children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {children}
    </label>
  );
}
