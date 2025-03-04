
import { supabase } from "@/integrations/supabase/client";
import type { ActivityImage } from "@/types/database.types";

export const uploadActivityImage = async (
  imageFile: File,
  userId: string
): Promise<string | null> => {
  try {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `activity-images/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('activity-images')
      .upload(filePath, imageFile);
    
    if (uploadError) throw uploadError;
    
    const { data } = supabase.storage
      .from('activity-images')
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};

export const saveActivityImages = async (
  activityId: string,
  imageUrls: string[]
): Promise<ActivityImage[]> => {
  try {
    const imagesToInsert = imageUrls.map(url => ({
      activity_id: activityId,
      image_url: url
    }));

    const { data, error } = await supabase
      .from('activity_images')
      .insert(imagesToInsert)
      .select();

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error saving activity images:", error);
    return [];
  }
};

export const fetchActivityImages = async (
  activityId: string
): Promise<ActivityImage[]> => {
  try {
    const { data, error } = await supabase
      .from('activity_images')
      .select('*')
      .eq('activity_id', activityId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching activity images:", error);
    return [];
  }
};

export const deleteActivityImage = async (
  imageId: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('activity_images')
      .delete()
      .eq('id', imageId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting activity image:", error);
    return false;
  }
};
