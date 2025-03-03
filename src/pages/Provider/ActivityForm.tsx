
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Activity } from "@/types/database.types";
import ActivityBasicDetails from "./components/ActivityBasicDetails";
import ActivityImageUpload from "./components/ActivityImageUpload";
import ActivityDetailsFields from "./components/ActivityDetailsFields";
import { uploadActivityImage } from "@/services/imageUploadService";

const ActivityForm = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
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
        setActivity({
          ...data,
          duration: String(data.duration),
        });
        
        if (data.image_url) {
          setImagePreview(data.image_url);
        }
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

      if (!activity.title || !activity.description || !activity.location || 
          !activity.category || !activity.age_range || !activity.capacity || 
          activity.price === undefined || !activity.duration) {
        throw new Error("Please fill in all required fields");
      }

      // Upload image if there's a new one
      let imageUrl = activity.image_url;
      if (imageFile && user) {
        setUploadingImage(true);
        imageUrl = await uploadActivityImage(imageFile, user.id);
        setUploadingImage(false);
      }

      const activityData = {
        title: activity.title,
        description: activity.description,
        location: activity.location,
        category: activity.category,
        age_range: activity.age_range,
        capacity: activity.capacity,
        price: activity.price,
        duration: String(activity.duration),
        provider_id: user.id,
        image_url: imageUrl,
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
        <ActivityBasicDetails 
          activity={activity} 
          setActivity={setActivity} 
        />

        <ActivityImageUpload 
          initialImageUrl={activity.image_url} 
          onImageChange={setImageFile}
          onImagePreviewChange={setImagePreview}
        />

        <ActivityDetailsFields 
          activity={activity} 
          setActivity={setActivity} 
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/provider/dashboard")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading || uploadingImage}>
            {loading || uploadingImage ? "Saving..." : id ? "Update Activity" : "Create Activity"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ActivityForm;
