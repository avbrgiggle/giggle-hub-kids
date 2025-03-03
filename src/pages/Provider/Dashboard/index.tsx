
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ActivitiesTab from "./components/ActivitiesTab";
import BookingsTab from "./components/BookingsTab";
import AnalyticsTab from "./components/AnalyticsTab";
import ProfileTab from "./components/ProfileTab";
import MessagesTab from "./components/MessagesTab";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export default function ProviderDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isProvider, setIsProvider] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const checkProviderStatus = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        if (data?.role !== "provider") {
          toast({
            variant: "destructive",
            title: "Access denied",
            description: "This area is only for activity providers.",
          });
          navigate("/");
          return;
        }

        setIsProvider(true);
      } catch (error: any) {
        console.error("Error checking provider status:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to verify your account status.",
        });
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    checkProviderStatus();
  }, [user, navigate, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isProvider) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Provider Dashboard</h1>
      
      <Tabs defaultValue="activities" className="w-full">
        <TabsList className="mb-8 w-full flex justify-start overflow-x-auto">
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
}
