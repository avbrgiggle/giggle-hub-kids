
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud } from "lucide-react";

interface LogoUploadFieldProps {
  logoPreview: string | null;
  onLogoChange: (file: File | null) => void;
}

export function LogoUploadField({ logoPreview, onLogoChange }: LogoUploadFieldProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onLogoChange(file);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="logo">Company Logo</Label>
      <div className="border rounded-md p-4 flex flex-col items-center justify-center bg-gray-50">
        {logoPreview ? (
          <div className="mb-4">
            <img 
              src={logoPreview} 
              alt="Logo preview" 
              className="w-32 h-32 object-contain"
            />
          </div>
        ) : (
          <div className="mb-4 w-32 h-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
            <UploadCloud className="h-8 w-8 text-gray-400" />
          </div>
        )}
        <Input
          id="logo"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="max-w-sm"
        />
        <p className="text-xs text-gray-500 mt-2">Upload your company logo (recommended size: 200x200px)</p>
      </div>
    </div>
  );
}
