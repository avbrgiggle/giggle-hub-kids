
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ActivityImage } from "@/types/database.types";

interface ActivityImageUploadProps {
  initialImages?: ActivityImage[];
  mainImageUrl?: string | null;
  onImagesChange: (files: File[]) => void;
  onImagesPreviewChange: (previews: string[]) => void;
  onImageDelete?: (imageId: string) => Promise<void>;
  maxImages?: number;
}

const ActivityImageUpload = ({
  initialImages = [],
  mainImageUrl,
  onImagesChange,
  onImagesPreviewChange,
  onImageDelete,
  maxImages = 5,
}: ActivityImageUploadProps) => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<ActivityImage[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const initialPreviews: string[] = [];
    
    // Add main image first if it exists
    if (mainImageUrl) {
      initialPreviews.push(mainImageUrl);
    }
    
    // Add existing images from the database
    if (initialImages.length > 0) {
      const dbImages = initialImages.map(img => img.image_url);
      // Avoid duplicating main image if it's also in initialImages
      dbImages.forEach(url => {
        if (url !== mainImageUrl) {
          initialPreviews.push(url);
        }
      });
      setExistingImages(initialImages);
    }
    
    setImagePreviews(initialPreviews);
    onImagesPreviewChange(initialPreviews);
  }, [initialImages, mainImageUrl, onImagesPreviewChange]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const totalImagesCount = imagePreviews.length + files.length;
    
    if (totalImagesCount > maxImages) {
      toast({
        variant: "destructive",
        title: "Too many images",
        description: `You can only upload up to ${maxImages} images.`,
      });
      return;
    }
    
    const newFiles = Array.from(files);
    setImageFiles(prev => [...prev, ...newFiles]);
    
    // Create previews for new files
    const newFilePreviews: string[] = [];
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const preview = reader.result as string;
        setImagePreviews(prev => {
          const updated = [...prev, preview];
          onImagesPreviewChange(updated);
          return updated;
        });
        newFilePreviews.push(preview);
      };
      reader.readAsDataURL(file);
    });
    
    onImagesChange([...imageFiles, ...newFiles]);
    
    // Reset the input value so the same file can be selected again
    e.target.value = '';
  };

  const handleRemoveImage = async (index: number) => {
    // Check if it's an existing image from the database
    const isExistingImage = index < existingImages.length;
    
    if (isExistingImage && onImageDelete) {
      const imageToDelete = existingImages[index];
      setIsDeleting(imageToDelete.id);
      
      try {
        await onImageDelete(imageToDelete.id);
        setExistingImages(prev => prev.filter(img => img.id !== imageToDelete.id));
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete image. Please try again.",
        });
      } finally {
        setIsDeleting(null);
      }
    }
    
    // Remove from previews array
    setImagePreviews(prev => {
      const updated = prev.filter((_, i) => i !== index);
      onImagesPreviewChange(updated);
      return updated;
    });
    
    // Remove from files array if it's a newly added file
    if (!isExistingImage) {
      const fileIndex = index - existingImages.length;
      if (fileIndex >= 0) {
        setImageFiles(prev => prev.filter((_, i) => i !== fileIndex));
        onImagesChange(imageFiles.filter((_, i) => i !== fileIndex));
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label htmlFor="images">Activity Images</Label>
        <div className="text-sm text-muted-foreground">
          {imagePreviews.length} / {maxImages} images
        </div>
      </div>
      
      {imagePreviews.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {imagePreviews.map((preview, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-2">
                <div className="aspect-video relative group">
                  <img 
                    src={preview} 
                    alt={`Activity preview ${index + 1}`} 
                    className="w-full h-full object-cover rounded-md"
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemoveImage(index)}
                      disabled={isDeleting === (existingImages[index]?.id || '')}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                      Main Image
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {imagePreviews.length < maxImages && (
            <label 
              htmlFor="add-image" 
              className="border-2 border-dashed border-muted-foreground/20 rounded-md aspect-video flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <Plus className="h-6 w-6 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">Add Image</span>
              <Input
                id="add-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center p-8 border-2 border-dashed border-muted-foreground/20 rounded-md">
          <Image className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No images added yet</h3>
          <p className="text-sm text-muted-foreground mb-4 text-center">
            Upload up to {maxImages} images to showcase your activity
          </p>
          <label htmlFor="images">
            <Button variant="outline" className="cursor-pointer">
              <Plus className="h-4 w-4 mr-2" />
              Upload Images
            </Button>
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default ActivityImageUpload;
