
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { PlusCircle, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Activity } from "@/types/database.types";

export default function ActivitiesTab() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (!user) return;
    fetchActivities();
  }, [user]);

  useEffect(() => {
    filterActivities();
  }, [activities, searchQuery, categoryFilter]);

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("provider_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Convert duration to string type for each activity
      const formattedActivities = (data || []).map(activity => ({
        ...activity,
        duration: String(activity.duration)
      }));
      
      setActivities(formattedActivities);
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

  const filterActivities = () => {
    let filtered = [...activities];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(activity => 
        activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(activity => 
        activity.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }
    
    setFilteredActivities(filtered);
  };

  const getUniqueCategories = () => {
    const categories = new Set<string>();
    activities.forEach(activity => categories.add(activity.category.toLowerCase()));
    return Array.from(categories);
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-2xl font-semibold">My Activities</h2>
        <Button onClick={() => navigate("/provider/activities/new")}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Activity
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {getUniqueCategories().map(category => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredActivities.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              {activities.length === 0 
                ? "You haven't created any activities yet." 
                : "No activities match your search criteria."}
            </p>
            {activities.length === 0 && (
              <Button onClick={() => navigate("/provider/activities/new")}>
                Create Your First Activity
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredActivities.map((activity) => (
            <Card key={activity.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="line-clamp-1">{activity.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-md overflow-hidden mb-4">
                  <img
                    src={activity.image_url || "https://images.unsplash.com/photo-1472396961693-142e6e269027"}
                    alt={activity.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                    {activity.category}
                  </span>
                  <span className="bg-secondary/10 text-secondary px-2 py-1 rounded-full text-xs">
                    {activity.age_range}
                  </span>
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
