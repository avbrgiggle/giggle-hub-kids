
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Loader2, Calendar, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Activity } from "@/types/database.types";

export default function ActivitiesTab() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [regularActivities, setRegularActivities] = useState<Activity[]>([]);
  const [extracurricularActivities, setExtracurricularActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (user) {
      fetchActivities();
    }
  }, [user]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      
      // Fetch regular activities
      const { data: regularData, error: regularError } = await supabase
        .from("activities")
        .select("*")
        .eq("provider_id", user?.id)
        .eq("is_extracurricular", false)
        .order("created_at", { ascending: false });

      if (regularError) throw regularError;
      
      // Fetch extracurricular activities
      const { data: extracurricularData, error: extracurricularError } = await supabase
        .from("activities")
        .select("*")
        .eq("provider_id", user?.id)
        .eq("is_extracurricular", true)
        .order("created_at", { ascending: false });

      if (extracurricularError) throw extracurricularError;
      
      // Convert duration to string type for each activity
      const formattedRegularActivities = (regularData || []).map(activity => ({
        ...activity,
        duration: String(activity.duration)
      }));
      
      const formattedExtracurricularActivities = (extracurricularData || []).map(activity => ({
        ...activity,
        duration: String(activity.duration)
      }));
      
      setRegularActivities(formattedRegularActivities);
      setExtracurricularActivities(formattedExtracurricularActivities);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">My Activities</h2>
        <div className="flex gap-2">
          <Button onClick={() => navigate("/provider/activities/new")}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Regular Activity
          </Button>
          <Button onClick={() => navigate("/provider/extracurricular/new")} variant="outline">
            <BookOpen className="h-4 w-4 mr-2" />
            Add Extracurricular
          </Button>
        </div>
      </div>

      <Tabs defaultValue="regular" className="w-full">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="regular" className="flex-1">
            <Calendar className="h-4 w-4 mr-2" />
            Regular Activities
          </TabsTrigger>
          <TabsTrigger value="extracurricular" className="flex-1">
            <BookOpen className="h-4 w-4 mr-2" />
            Extracurricular Activities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="regular">
          {regularActivities.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <p className="text-muted-foreground mb-4">
                  You haven't created any regular activities yet.
                </p>
                <Button onClick={() => navigate("/provider/activities/new")}>
                  Create Your First Activity
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {regularActivities.map((activity) => (
                <ActivityCard 
                  key={activity.id} 
                  activity={activity} 
                  onClick={() => navigate(`/provider/activities/${activity.id}`)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="extracurricular">
          {extracurricularActivities.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <p className="text-muted-foreground mb-4">
                  You haven't created any extracurricular activities yet.
                </p>
                <Button onClick={() => navigate("/provider/extracurricular/new")}>
                  Create Your First Extracurricular Activity
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {extracurricularActivities.map((activity) => (
                <ActivityCard 
                  key={activity.id} 
                  activity={activity} 
                  onClick={() => navigate(`/provider/extracurricular/${activity.id}`)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface ActivityCardProps {
  activity: Activity;
  onClick: () => void;
}

function ActivityCard({ activity, onClick }: ActivityCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
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
          onClick={onClick}
        >
          Manage Activity
        </Button>
      </CardContent>
    </Card>
  );
}
