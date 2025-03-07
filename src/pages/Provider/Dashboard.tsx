
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PlusCircle, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import type { Activity } from "@/types/database.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function ProviderDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log("Dashboard rendering - User:", user?.id);

  useEffect(() => {
    if (!user) {
      console.log("No user found in dashboard");
      return;
    }

    fetchActivities();
  }, [user]);

  const fetchActivities = async () => {
    try {
      console.log("Fetching activities for provider:", user?.id);
      setError(null);
      setLoading(true);
      
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("provider_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching activities:", error);
        throw error;
      }
      
      console.log("Activities fetched:", data?.length);
      
      // Convert duration to string type for each activity
      const formattedActivities = (data || []).map(activity => ({
        ...activity,
        duration: String(activity.duration)
      }));
      
      setActivities(formattedActivities);
    } catch (error: any) {
      console.error("Error in fetchActivities:", error);
      setError(error.message || "Failed to load activities");
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Could not load your activities",
      });
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-6 mb-8">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <h2 className="text-lg font-medium text-red-800">Error Loading Dashboard</h2>
          </div>
          <p className="mt-2 text-sm text-red-700">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={fetchActivities}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin mb-2" />
        <span>Loading your activities...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Activities</h1>
        <Button onClick={() => navigate("/provider/activities/new")}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Activity
        </Button>
      </div>

      {activities.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground mb-4">
              You haven't created any activities yet.
            </p>
            <Button onClick={() => navigate("/provider/activities/new")}>
              Create Your First Activity
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity) => (
            <Card key={activity.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{activity.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-md overflow-hidden mb-4">
                  <img
                    src={activity.image_url || "https://images.unsplash.com/photo-1472396961693-142e6e269027"}
                    alt={activity.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {activity.description}
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate(`/provider/activities/${activity.id}`)}
                >
                  Manage Activity
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
