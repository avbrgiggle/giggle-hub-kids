
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Activity } from "@/types/database.types";
import { HeaderActions } from "./components/HeaderActions";
import { SearchBar } from "./components/SearchBar";
import { AgeRangeSlider } from "./components/AgeRangeSlider";
import { Categories } from "./components/Categories";
import { ActivityCard } from "./components/ActivityCard";

const CATEGORIES = [
  "All",
  "Sports",
  "Arts & Crafts",
  "Education",
  "Music",
  "Dance",
  "Science",
  "Nature",
];

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [ageRange, setAgeRange] = useState([0, 18]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchActivities();
  }, [selectedCategory]);

  const fetchActivities = async () => {
    try {
      let query = supabase
        .from("activities")
        .select("*, provider:profiles(id, full_name, avatar_url, phone, role)");

      if (selectedCategory !== "All") {
        query = query.eq("category", selectedCategory);
      }

      const { data, error } = await query;

      if (error) throw error;

      const formattedActivities: Activity[] = (data || []).map(activity => ({
        ...activity,
        duration: String(activity.duration),
        provider: activity.provider ? {
          ...activity.provider,
          role: activity.provider.role as 'parent' | 'provider',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } : undefined
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

  const handleSave = (activityId: string) => {
    toast({
      title: "Activity saved",
      description: "The activity has been saved to your favorites",
    });
  };

  const handleAgeRangeChange = (newValue: number[]) => {
    if (newValue[0] <= newValue[1]) {
      setAgeRange(newValue);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 animate-fade-in">
      <div className="bg-accent text-white py-16">
        <div className="container">
          <div className="flex flex-col items-center mb-8">
            <HeaderActions />
            <img 
              src="/lovable-uploads/ef0c0ba4-8c77-4009-8669-dec94b2ec9de.png" 
              alt="Allegrow" 
              className="w-96 mb-4"
            />
          </div>

          <SearchBar />
          <AgeRangeSlider value={ageRange} onChange={handleAgeRangeChange} />
        </div>
      </div>

      <div className="container py-8">
        <Categories
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No activities found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity) => (
              <ActivityCard 
                key={activity.id} 
                activity={activity} 
                onSave={handleSave}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
