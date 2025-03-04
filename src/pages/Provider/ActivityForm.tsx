
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Activity, ActivityImage } from "@/types/database.types";
import ActivityBasicDetails from "./components/ActivityBasicDetails";
import ActivityImageUpload from "./components/ActivityImageUpload";
import ActivityDetailsFields from "./components/ActivityDetailsFields";
import { 
  uploadActivityImage, 
  saveActivityImages, 
  fetchActivityImages,
  deleteActivityImage
} from "@/services/imageUploadService";

const ActivityForm = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<ActivityImage[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
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
      fetchImages();
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
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const fetchImages = async () => {
    if (!id) return;
    
    try {
      const images = await fetchActivityImages(id);
      setExistingImages(images);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load images",
      });
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    const success = await deleteActivityImage(imageId);
    if (!success) {
      throw new Error("Failed to delete image");
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

      // Upload new images if there are any
      let uploadedImageUrls: string[] = [];
      
      if (imageFiles.length > 0) {
        setUploadingImages(true);
        
        // Upload all images
        const uploadPromises = imageFiles.map(file => 
          uploadActivityImage(file, user.id)
        );
        
        const results = await Promise.all(uploadPromises);
        uploadedImageUrls = results.filter((url): url is string => url !== null);
        
        setUploadingImages(false);
      }
      
      // Determine the main image URL
      let mainImageUrl = activity.image_url;
      
      // If we have a new main image (first in the list), use it
      if (uploadedImageUrls.length > 0 && !existingImages.length && !mainImageUrl) {
        mainImageUrl = uploadedImageUrls[0];
        // Remove it from the additional images
        uploadedImageUrls = uploadedImageUrls.slice(1);
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
        image_url: mainImageUrl,
      };

      let activityId = id;
      
      if (id) {
        // Update existing activity
        const { error } = await supabase
          .from("activities")
          .update(activityData)
          .eq("id", id);

        if (error) throw error;
      } else {
        // Create new activity
        const { data, error } = await supabase
          .from("activities")
          .insert([activityData])
          .select();

        if (error) throw error;
        activityId = data?.[0]?.id;
      }
      
      // Save additional images to activity_images table
      if (uploadedImageUrls.length > 0 && activityId) {
        await saveActivityImages(activityId, uploadedImageUrls);
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
          initialImages={existingImages}
          mainImageUrl={activity.image_url} 
          onImagesChange={setImageFiles}
          onImagesPreviewChange={setImagePreviews}
          onImageDelete={handleDeleteImage}
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
          <Button type="submit" disabled={loading || uploadingImages}>
            {loading || uploadingImages ? "Saving..." : id ? "Update Activity" : "Create Activity"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ActivityForm;
