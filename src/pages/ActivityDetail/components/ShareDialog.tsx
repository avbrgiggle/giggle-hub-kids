
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Check, Copy, Facebook, Instagram, Mail, Share2 } from "lucide-react";
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
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
              </svg>
              WhatsApp
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
