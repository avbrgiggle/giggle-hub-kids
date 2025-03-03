
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ActivitiesTab from "./components/ActivitiesTab";
import BookingsTab from "./components/BookingsTab";
import MessagesTab from "./components/MessagesTab";
import AnalyticsTab from "./components/AnalyticsTab";
import { ProfileTab } from "./components/ProfileTab"; // Using named import

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("activities");

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Provider Dashboard</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted grid grid-cols-5">
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activities">
          <ActivitiesTab />
        </TabsContent>
        
        <TabsContent value="bookings">
          <BookingsTab />
        </TabsContent>
        
        <TabsContent value="messages">
          <MessagesTab />
        </TabsContent>
        
        <TabsContent value="analytics">
          <AnalyticsTab />
        </TabsContent>
        
        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
