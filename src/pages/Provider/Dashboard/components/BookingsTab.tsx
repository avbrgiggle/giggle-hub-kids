
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BookingsTab() {
  const [status, setStatus] = useState("all");
  
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Bookings</h2>
        <p className="text-muted-foreground">Manage all your activity bookings in one place</p>
      </div>
      
      <Tabs value={status} onValueChange={setStatus} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <BookingList status="all" />
        </TabsContent>
        
        <TabsContent value="pending" className="mt-0">
          <BookingList status="pending" />
        </TabsContent>
        
        <TabsContent value="confirmed" className="mt-0">
          <BookingList status="confirmed" />
        </TabsContent>
        
        <TabsContent value="cancelled" className="mt-0">
          <BookingList status="cancelled" />
        </TabsContent>
        
        <TabsContent value="completed" className="mt-0">
          <BookingList status="completed" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface BookingListProps {
  status: string;
}

function BookingList({ status }: BookingListProps) {
  // This is a placeholder for the actual implementation
  // In a real implementation, we would fetch bookings from the backend
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookings Management</CardTitle>
        <CardDescription>
          This feature will be implemented in future updates.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center py-8 text-muted-foreground">
          The bookings management system is coming soon. You'll be able to:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>View all bookings for your activities</li>
          <li>Filter by status, date, and activity</li>
          <li>Confirm or cancel bookings</li>
          <li>Send notifications to participants</li>
          <li>Track attendance</li>
          <li>Export booking data</li>
        </ul>
      </CardContent>
    </Card>
  );
}
