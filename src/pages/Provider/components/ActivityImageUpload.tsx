
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ActivityImageUploadProps {
  initialImageUrl?: string | null;
  onImageChange: (file: File | null) => void;
  onImagePreviewChange: (preview: string | null) => void;
}

const ActivityImageUpload = ({
  initialImageUrl,
  onImageChange,
  onImagePreviewChange,
}: ActivityImageUploadProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  useEffect(() => {
    if (initialImageUrl) {
      setImagePreview(initialImageUrl);
      onImagePreviewChange(initialImageUrl);
    }
  }, [initialImageUrl, onImagePreviewChange]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    onImageChange(file);
    
    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const preview = reader.result as string;
      setImagePreview(preview);
      onImagePreviewChange(preview);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="image">Activity Image</Label>
      <div className="flex flex-col gap-4">
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="cursor-pointer"
        />
        
        {imagePreview && (
          <Card className="overflow-hidden">
            <CardContent className="p-2">
              <div className="aspect-video relative">
                <img 
                  src={imagePreview} 
                  alt="Activity preview" 
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ActivityImageUpload;
