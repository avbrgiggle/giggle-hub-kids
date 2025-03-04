
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Activity } from "@/types/database.types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ActivityImageUpload from "./components/ActivityImageUpload";
import { uploadActivityImage, saveActivityImages, fetchActivityImages, deleteActivityImage } from "@/services/imageUploadService";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const ExtracurricularActivityForm = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);
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
    is_extracurricular: true,
  });
  const [schedule, setSchedule] = useState<{
    days: string[];
    startTime: string;
    endTime: string;
  }>({
    days: [],
    startTime: "15:00",
    endTime: "16:00",
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
        .eq("is_extracurricular", true)
        .single();

      if (error) throw error;
      if (data) {
        setActivity({
          ...data,
          duration: String(data.duration),
        });
        
        // Parse the schedule from provider_info if it exists
        if (data.provider_info?.schedule) {
          setSchedule(data.provider_info.schedule);
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

  const handleDayToggle = (day: string) => {
    if (schedule.days.includes(day)) {
      setSchedule({
        ...schedule,
        days: schedule.days.filter(d => d !== day)
      });
    } else {
      setSchedule({
        ...schedule,
        days: [...schedule.days, day]
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

      if (schedule.days.length === 0) {
        throw new Error("Please select at least one day for the schedule");
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

      // Include schedule in provider_info
      const providerInfo = activity.provider_info || {};
      providerInfo.schedule = schedule;

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
        is_extracurricular: true,
        provider_info: providerInfo
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
        description: `Extracurricular activity ${id ? "updated" : "created"} successfully`,
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
        {id ? "Edit Extracurricular Activity" : "Create New Extracurricular Activity"}
      </h1>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="details">Basic Details</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit} className="space-y-6">
          <TabsContent value="details" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={activity.title || ""}
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
                value={activity.description || ""}
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
                  value={activity.location || ""}
                  onChange={(e) =>
                    setActivity((prev) => ({ ...prev, location: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={activity.category}
                  onValueChange={(value) => setActivity((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Arts & Crafts">Arts & Crafts</SelectItem>
                    <SelectItem value="Music">Music</SelectItem>
                    <SelectItem value="Dance">Dance</SelectItem>
                    <SelectItem value="STEM">STEM</SelectItem>
                    <SelectItem value="Languages">Languages</SelectItem>
                    <SelectItem value="Cooking">Cooking</SelectItem>
                    <SelectItem value="Outdoor Adventure">Outdoor Adventure</SelectItem>
                    <SelectItem value="Coding">Coding</SelectItem>
                    <SelectItem value="Robotics">Robotics</SelectItem>
                    <SelectItem value="Theatre">Theatre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="age_range">Age Range</Label>
                <Input
                  id="age_range"
                  value={activity.age_range || ""}
                  onChange={(e) =>
                    setActivity((prev) => ({ ...prev, age_range: e.target.value }))
                  }
                  placeholder="e.g., 5-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Max Students</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={activity.capacity || ""}
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
                <Label htmlFor="price">Monthly Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={activity.price || ""}
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
                <Label htmlFor="duration">Session Duration</Label>
                <Select
                  value={activity.duration}
                  onValueChange={(value) => setActivity((prev) => ({ ...prev, duration: value }))}
                >
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30 min">30 minutes</SelectItem>
                    <SelectItem value="45 min">45 minutes</SelectItem>
                    <SelectItem value="1 hour">1 hour</SelectItem>
                    <SelectItem value="1.5 hours">1.5 hours</SelectItem>
                    <SelectItem value="2 hours">2 hours</SelectItem>
                    <SelectItem value="3 hours">3 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Days</Label>
                  <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map((day) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`day-${day}`} 
                          checked={schedule.days.includes(day)}
                          onCheckedChange={() => handleDayToggle(day)}
                        />
                        <label
                          htmlFor={`day-${day}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {day}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={schedule.startTime}
                      onChange={(e) =>
                        setSchedule((prev) => ({ ...prev, startTime: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={schedule.endTime}
                      onChange={(e) =>
                        setSchedule((prev) => ({ ...prev, endTime: e.target.value }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images" className="space-y-6">
            <ActivityImageUpload 
              initialImages={existingImages}
              mainImageUrl={activity.image_url} 
              onImagesChange={setImageFiles}
              onImagesPreviewChange={setImagePreviews}
              onImageDelete={handleDeleteImage}
            />
          </TabsContent>

          <div className="flex justify-end gap-4 pt-6">
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
      </Tabs>
    </div>
  );
};

export default ExtracurricularActivityForm;
