
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
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
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    filterActivities();
  }, [selectedCategory, ageRange, searchTerm, activities]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("activities")
        .select("*, provider:profiles(id, full_name, avatar_url, phone, role)");

      if (error) throw error;

      const formattedActivities: Activity[] = (data || []).map(activity => ({
        ...activity,
        duration: String(activity.duration),
        provider: activity.provider ? {
          ...activity.provider,
          role: activity.provider.role as 'parent' | 'provider' | 'admin' | string,
          created_at: activity.provider.created_at || new Date().toISOString(),
          updated_at: activity.provider.updated_at || new Date().toISOString()
        } : undefined
      }));

      setActivities(formattedActivities);
    } catch (error: any) {
      console.error("Error fetching activities:", error);
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
    
    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(activity => activity.category === selectedCategory);
    }
    
    // Filter by age range
    filtered = filtered.filter(activity => {
      // Parse age range (format example: "3-6", "7-10", etc.)
      const [min, max] = activity.age_range.split('-').map(Number);
      return (
        (min >= ageRange[0] && min <= ageRange[1]) || 
        (max >= ageRange[0] && max <= ageRange[1]) ||
        (min <= ageRange[0] && max >= ageRange[1])
      );
    });
    
    // Filter by search term
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(activity => 
        activity.title.toLowerCase().includes(lowercasedSearch) ||
        activity.description.toLowerCase().includes(lowercasedSearch) ||
        activity.location.toLowerCase().includes(lowercasedSearch) ||
        activity.provider?.full_name?.toLowerCase().includes(lowercasedSearch)
      );
    }
    
    setFilteredActivities(filtered);
  };

  const handleAgeRangeChange = (newValue: number[]) => {
    if (newValue[0] <= newValue[1]) {
      setAgeRange(newValue);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleSave = (activityId: string) => {
    toast({
      title: t("activity.saved"),
      description: t("activity.savedDesc"),
    });
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

          <SearchBar onSearch={handleSearch} />
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
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No activities found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity) => (
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
