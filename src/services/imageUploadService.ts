
import { supabase } from "@/integrations/supabase/client";

export const uploadActivityImage = async (
  imageFile: File,
  userId: string
): Promise<string | null> => {
  try {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `activity-images/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('public')
      .upload(filePath, imageFile);
    
    if (uploadError) throw uploadError;
    
    const { data } = supabase.storage
      .from('public')
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};
