
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { format, parseISO } from "date-fns";
import type { ActivityDate, Child } from "@/types/database.types";
import { useNavigate } from "react-router-dom";

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: Child[];
  selectedDate: ActivityDate | null;
  selectedChild: string;
  onChildChange: (value: string) => void;
  onBook: () => void;
  isAuthenticated: boolean;
}

export function BookingDialog({
  open,
  onOpenChange,
  children,
  selectedDate,
  selectedChild,
  onChildChange,
  onBook,
  isAuthenticated,
}: BookingDialogProps) {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book Activity</DialogTitle>
          <DialogDescription>
            Select a child and confirm your booking
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {!isAuthenticated ? (
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Please log in to book this activity
              </p>
              <Button onClick={() => navigate("/login")}>Log In</Button>
            </div>
          ) : (
            <>
              {children.length === 0 ? (
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Add a child to your profile to book activities
                  </p>
                  <Button onClick={() => navigate("/profile")}>
                    Go to Profile
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label>Select Child</Label>
                    <Select
                      value={selectedChild}
                      onValueChange={onChildChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a child" />
                      </SelectTrigger>
                      <SelectContent>
                        {children.map((child) => (
                          <SelectItem key={child.id} value={child.id}>
                            {child.first_name} {child.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedDate && (
                    <div className="space-y-2">
                      <Label>Selected Date</Label>
                      <p className="text-sm">
                        {format(parseISO(selectedDate.start_time), "PPP")} at{" "}
                        {format(parseISO(selectedDate.start_time), "p")}
                      </p>
                    </div>
                  )}

                  <Button
                    className="w-full"
                    onClick={onBook}
                    disabled={!selectedDate || !selectedChild}
                  >
                    Confirm Booking
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
