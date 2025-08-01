
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ActivitiesTab from "./components/ActivitiesTab";
import StudentsTab from "./components/StudentsTab";
import MessagesTab from "./components/MessagesTab";
import PaymentsTab from "./components/PaymentsTab";
import AnalyticsTab from "./components/AnalyticsTab";
import ProfileTab from "./components/ProfileTab";

export default function ProviderDashboard() {
  const [activeTab, setActiveTab] = useState("activities");
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/provider/analytics") {
      setActiveTab("analytics");
    } else if (location.pathname === "/provider/dashboard" || location.pathname === "/provider") {
      setActiveTab("activities");
    }
  }, [location.pathname]);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Provider Dashboard</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-6 mb-8">
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="activities" className="space-y-4">
          <ActivitiesTab />
        </TabsContent>
        
        <TabsContent value="students" className="space-y-4">
          <StudentsTab />
        </TabsContent>
        
        <TabsContent value="messages" className="space-y-4">
          <MessagesTab />
        </TabsContent>
        
        <TabsContent value="payments" className="space-y-4">
          <PaymentsTab />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsTab />
        </TabsContent>
        
        <TabsContent value="profile" className="space-y-4">
          <ProfileTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
