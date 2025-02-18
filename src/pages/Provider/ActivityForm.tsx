
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Activity } from "@/types/database.types";

export default function ActivityForm() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activity, setActivity] = useState<Partial<Activity>>({
    title: "",
    description: "",
    location: "",
    category: "",
    age_range: "",
    capacity: 10,
    price: 0,
    duration: "1 hour",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (id) {
      fetchActivity();
    }
  }, [id, user, navigate]);

  const fetchActivity = async () => {
    try {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (data) {
        // Ensure duration is converted to string
        setActivity({
          ...data,
          duration: String(data.duration),
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user) throw new Error("Not authenticated");

      // Ensure all required fields are present
      if (!activity.title || !activity.description || !activity.location || 
          !activity.category || !activity.age_range || !activity.capacity || 
          activity.price === undefined || !activity.duration) {
        throw new Error("Please fill in all required fields");
      }

      // Create a properly typed activity object
      const activityData = {
        title: activity.title,
        description: activity.description,
        location: activity.location,
        category: activity.category,
        age_range: activity.age_range,
        capacity: activity.capacity,
        price: activity.price,
        duration: activity.duration,
        provider_id: user.id,
        image_url: activity.image_url || null,
      };

      if (id) {
        const { error } = await supabase
          .from("activities")
          .update(activityData)
          .eq("id", id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("activities")
          .insert([activityData]);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Activity ${id ? "updated" : "created"} successfully`,
      });
      navigate("/provider/dashboard");
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

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">
        {id ? "Edit Activity" : "Create New Activity"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={activity.title}
            onChange={(e) =>
              setActivity((prev) => ({ ...prev, title: e.target.value }))
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={activity.description}
            onChange={(e) =>
              setActivity((prev) => ({ ...prev, description: e.target.value }))
            }
            required
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={activity.location}
              onChange={(e) =>
                setActivity((prev) => ({ ...prev, location: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={activity.category}
              onChange={(e) =>
                setActivity((prev) => ({ ...prev, category: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age_range">Age Range</Label>
            <Input
              id="age_range"
              value={activity.age_range}
              onChange={(e) =>
                setActivity((prev) => ({ ...prev, age_range: e.target.value }))
              }
              placeholder="e.g., 5-12"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              value={activity.capacity}
              onChange={(e) =>
                setActivity((prev) => ({
                  ...prev,
                  capacity: parseInt(e.target.value),
                }))
              }
              required
              min={1}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              value={activity.price}
              onChange={(e) =>
                setActivity((prev) => ({
                  ...prev,
                  price: parseFloat(e.target.value),
                }))
              }
              required
              min={0}
              step={0.01}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              value={activity.duration}
              onChange={(e) =>
                setActivity((prev) => ({ ...prev, duration: e.target.value }))
              }
              placeholder="e.g., 1 hour"
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/provider/dashboard")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : id ? "Update Activity" : "Create Activity"}
          </Button>
        </div>
      </form>
    </div>
  );
}
