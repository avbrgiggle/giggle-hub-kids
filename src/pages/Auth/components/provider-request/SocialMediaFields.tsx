
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SocialMediaFieldsProps {
  formData: {
    websiteUrl: string;
    facebookUrl: string;
    instagramUrl: string;
    linkedinUrl: string;
    tiktokUrl: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export function SocialMediaFields({ formData, onInputChange }: SocialMediaFieldsProps) {
  return (
    <div className="pt-4 border-t">
      <h3 className="text-lg font-medium mb-4">Social Media & Web Presence (Optional)</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="websiteUrl">Website URL</Label>
          <Input
            id="websiteUrl"
            value={formData.websiteUrl}
            onChange={(e) => onInputChange("websiteUrl", e.target.value)}
            placeholder="https://example.com"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="facebookUrl">Facebook URL</Label>
          <Input
            id="facebookUrl"
            value={formData.facebookUrl}
            onChange={(e) => onInputChange("facebookUrl", e.target.value)}
            placeholder="https://facebook.com/page"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="instagramUrl">Instagram URL</Label>
          <Input
            id="instagramUrl"
            value={formData.instagramUrl}
            onChange={(e) => onInputChange("instagramUrl", e.target.value)}
            placeholder="https://instagram.com/handle"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
          <Input
            id="linkedinUrl"
            value={formData.linkedinUrl}
            onChange={(e) => onInputChange("linkedinUrl", e.target.value)}
            placeholder="https://linkedin.com/in/profile"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tiktokUrl">TikTok URL</Label>
          <Input
            id="tiktokUrl"
            value={formData.tiktokUrl}
            onChange={(e) => onInputChange("tiktokUrl", e.target.value)}
            placeholder="https://tiktok.com/@handle"
          />
        </div>
      </div>
    </div>
  );
}
