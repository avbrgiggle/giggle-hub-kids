
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Check, Copy, Facebook, Instagram, Mail, Twitter, WhatsApp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activityTitle: string;
  activityUrl: string;
}

export const ShareDialog = ({ open, onOpenChange, activityTitle, activityUrl }: ShareDialogProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(activityUrl);
      setCopied(true);
      toast({
        title: "Success",
        description: "Link copied to clipboard",
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy link",
      });
    }
  };
  
  const shareViaEmail = () => {
    window.open(`mailto:?subject=${encodeURIComponent(`Check out this activity: ${activityTitle}`)}&body=${encodeURIComponent(`I found this activity and thought you might be interested: ${activityUrl}`)}`, '_blank');
    onOpenChange(false);
  };
  
  const shareViaFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(activityUrl)}`, '_blank');
    onOpenChange(false);
  };
  
  const shareViaInstagram = () => {
    // Instagram doesn't have a direct sharing API like Facebook
    // Usually, users would share a screenshot or copy the link
    window.open('https://www.instagram.com/', '_blank');
    onOpenChange(false);
  };
  
  const shareViaWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`Check out this activity: ${activityTitle} ${activityUrl}`)}`, '_blank');
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this activity</DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center space-x-2 mt-2">
          <div className="grid flex-1 gap-2">
            <Input
              value={activityUrl}
              readOnly
              className="w-full"
            />
          </div>
          <Button 
            type="button" 
            size="sm" 
            className="px-3"
            onClick={copyToClipboard}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className="flex flex-col gap-4 mt-4">
          <p className="text-sm text-muted-foreground">Or share via</p>
          
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={shareViaEmail} className="flex gap-2">
              <Mail className="h-4 w-4" /> Email
            </Button>
            <Button variant="outline" onClick={shareViaWhatsApp} className="flex gap-2 text-green-600">
              <WhatsApp className="h-4 w-4" /> WhatsApp
            </Button>
            <Button variant="outline" onClick={shareViaFacebook} className="flex gap-2 text-blue-600">
              <Facebook className="h-4 w-4" /> Facebook
            </Button>
            <Button variant="outline" onClick={shareViaInstagram} className="flex gap-2 text-pink-600">
              <Instagram className="h-4 w-4" /> Instagram
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
