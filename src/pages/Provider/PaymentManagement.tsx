import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Search, Plus, Filter, Download, CreditCard, Mail, AlertTriangle, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { getStudents, getStudentActivities, getPayments, addPayment } from "@/services/providerService";
import { Student, StudentActivity, Payment } from "@/types/database.types";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

export default function PaymentManagement() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [studentActivities, setStudentActivities] = useState<StudentActivity[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false);
  const [newPayment, setNewPayment] = useState({
    student_activity_id: "",
    amount: "",
    method: "credit_card",
    status: "paid",
    invoice_number: "",
    notes: ""
  });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        const [studentsData, activitiesData, paymentsData] = await Promise.all([
          getStudents(user.id),
          getStudentActivities(user.id),
          getPayments(user.id)
        ]);
        
        setStudents(studentsData);
        setStudentActivities(activitiesData);
        setPayments(paymentsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load payment data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleAddPayment = async () => {
    if (!newPayment.student_activity_id || !newPayment.amount) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setProcessing(true);
      
      const paymentData = {
        student_activity_id: newPayment.student_activity_id,
        amount: parseFloat(newPayment.amount),
        date: new Date().toISOString(),
        method: newPayment.method as any,
        status: newPayment.status as any,
        invoice_number: newPayment.invoice_number || undefined,
        notes: newPayment.notes || undefined
      };
      
      const result = await addPayment(paymentData);
      
      setPayments(prev => [result, ...prev]);
      
      setStudentActivities(prev => 
        prev.map(sa => {
          if (sa.id === newPayment.student_activity_id) {
            return {
              ...sa,
              payment_status: newPayment.status as any,
              last_payment_date: new Date().toISOString()
            };
          }
          return sa;
        })
      );
      
      toast({
        title: "Success",
        description: "Payment has been recorded successfully.",
      });
      
      setNewPayment({
        student_activity_id: "",
        amount: "",
        method: "credit_card",
        status: "paid",
        invoice_number: "",
        notes: ""
      });
      setShowAddPaymentDialog(false);
    } catch (error) {
      console.error("Error adding payment:", error);
      toast({
        title: "Error",
        description: "Failed to record payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const filteredPayments = payments.filter(payment => {
    if (statusFilter !== "all" && payment.status !== statusFilter) {
      return false;
    }
    
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-green-500 text-white">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Paid
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      case "refunded":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
            <RefreshCcw className="h-3 w-3 mr-1" />
            Refunded
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const upcomingPayments = studentActivities
    .filter(sa => sa.payment_status === "pending" || (
      sa.active && 
      (!sa.last_payment_date || new Date(sa.last_payment_date).getMonth() < new Date().getMonth())
    ))
    .map(sa => ({
      id: sa.id,
      student: students.find(s => s.id === sa.student_id),
      activity: sa.activity,
      dueDate: new Date().toISOString(),
      amount: sa.activity?.price || 0,
      status: sa.payment_status
    }));

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Payment Management</h1>

      <Tabs defaultValue="payments" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="payments">Payment History</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Payments</TabsTrigger>
          <TabsTrigger value="reports">Financial Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="payments">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by student name..." 
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button onClick={() => setShowAddPaymentDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Record Payment
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-0">
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <p>Loading payment history...</p>
                </div>
              ) : filteredPayments.length === 0 ? (
                <div className="text-center py-8 border-t">
                  <p className="text-muted-foreground">No payments found</p>
                  <Button variant="outline" className="mt-4" onClick={() => setShowAddPaymentDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Record Your First Payment
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead className="hidden md:table-cell">Activity</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden lg:table-cell">Invoice</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => {
                      const studentName = "Student Name";
                      const activityTitle = "Activity Title";
                      
                      return (
                        <TableRow key={payment.id}>
                          <TableCell>{format(new Date(payment.date), "MMM d, yyyy")}</TableCell>
                          <TableCell>{studentName}</TableCell>
                          <TableCell className="hidden md:table-cell">{activityTitle}</TableCell>
                          <TableCell className="font-medium">€{payment.amount.toFixed(2)}</TableCell>
                          <TableCell className="capitalize">
                            {payment.method === "credit_card" ? (
                              <div className="flex items-center">
                                <CreditCard className="h-3 w-3 mr-1" />
                                Credit Card
                              </div>
                            ) : (
                              payment.method.replace("_", " ")
                            )}
                          </TableCell>
                          <TableCell>{getStatusBadge(payment.status)}</TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {payment.invoice_number || "-"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="upcoming">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Upcoming Payments</CardTitle>
              <Button>
                <Mail className="h-4 w-4 mr-2" />
                Send Payment Reminders
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <p>Loading upcoming payments...</p>
                </div>
              ) : upcomingPayments.length === 0 ? (
                <div className="text-center py-8 border-t">
                  <p className="text-muted-foreground">No upcoming payments found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead className="hidden md:table-cell">Activity</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          {payment.student ? (
                            `${payment.student.first_name} ${payment.student.last_name}`
                          ) : (
                            "Unknown Student"
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {payment.activity?.title || "Unknown Activity"}
                        </TableCell>
                        <TableCell>{format(new Date(payment.dueDate), "MMM d, yyyy")}</TableCell>
                        <TableCell className="font-medium">€{payment.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          {getStatusBadge(payment.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => {
                            setNewPayment({
                              ...newPayment,
                              student_activity_id: payment.id,
                              amount: payment.amount.toString()
                            });
                            setShowAddPaymentDialog(true);
                          }}>
                            Record Payment
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  €{payments
                    .filter(p => p.status === "paid")
                    .reduce((sum, p) => sum + Number(p.amount), 0)
                    .toFixed(2)
                  }
                </div>
                <p className="text-muted-foreground text-sm">All time</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Pending Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  €{upcomingPayments
                    .reduce((sum, p) => sum + Number(p.amount), 0)
                    .toFixed(2)
                  }
                </div>
                <p className="text-muted-foreground text-sm">{upcomingPayments.length} payments due</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Monthly Average</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  €{(payments.length > 0 
                    ? payments
                      .filter(p => p.status === "paid")
                      .reduce((sum, p) => sum + Number(p.amount), 0) / 
                      (new Date().getMonth() + 1) 
                    : 0).toFixed(2)
                  }
                </div>
                <p className="text-muted-foreground text-sm">Per month in {new Date().getFullYear()}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue by Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Chart placeholder - Revenue by activity type</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showAddPaymentDialog} onOpenChange={setShowAddPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Add a new payment record for a student's activity.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="student_activity">Student & Activity</Label>
              <Select 
                value={newPayment.student_activity_id} 
                onValueChange={(value) => setNewPayment({...newPayment, student_activity_id: value})}
              >
                <SelectTrigger id="student_activity">
                  <SelectValue placeholder="Select a student activity" />
                </SelectTrigger>
                <SelectContent>
                  {studentActivities.map(sa => {
                    const student = students.find(s => s.id === sa.student_id);
                    return (
                      <SelectItem key={sa.id} value={sa.id}>
                        {student?.first_name} {student?.last_name} - {sa.activity?.title}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (€)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={newPayment.amount}
                onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
                placeholder="0.00"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="method">Payment Method</Label>
                <Select 
                  value={newPayment.method} 
                  onValueChange={(value) => setNewPayment({...newPayment, method: value})}
                >
                  <SelectTrigger id="method">
                    <SelectValue />
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
                  onValueChange={(value) => setNewPayment({...newPayment, status: value})}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="invoice_number">Invoice Number (Optional)</Label>
              <Input
                id="invoice_number"
                value={newPayment.invoice_number}
                onChange={(e) => setNewPayment({...newPayment, invoice_number: e.target.value})}
                placeholder="Invoice #"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                value={newPayment.notes}
                onChange={(e) => setNewPayment({...newPayment, notes: e.target.value})}
                placeholder="Additional notes"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddPaymentDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddPayment} disabled={processing}>
              {processing ? "Processing..." : "Record Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const Clock = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const RefreshCcw = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 2v6h6" />
    <path d="M21 12A9 9 0 0 0 6 5.3L3 8" />
    <path d="M21 22v-6h-6" />
    <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7" />
  </svg>
);
