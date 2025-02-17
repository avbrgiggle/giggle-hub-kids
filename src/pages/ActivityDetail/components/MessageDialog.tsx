
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";

interface MessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: string;
  onMessageChange: (value: string) => void;
  onSend: () => void;
  isAuthenticated: boolean;
}

export function MessageDialog({
  open,
  onOpenChange,
  message,
  onMessageChange,
  onSend,
  isAuthenticated,
}: MessageDialogProps) {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Message</DialogTitle>
          <DialogDescription>
            Send a message to the activity provider
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {!isAuthenticated ? (
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Please log in to send messages
              </p>
              <Button onClick={() => navigate("/login")}>Log In</Button>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea
                  value={message}
                  onChange={(e) => onMessageChange(e.target.value)}
                  placeholder="Type your message here..."
                  rows={4}
                />
              </div>

              <Button
                className="w-full"
                onClick={onSend}
                disabled={!message.trim()}
              >
                Send Message
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
