import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  MessageCircle, 
  Star, 
  ChevronLeft,
  Building,
  FileText,
  Mail,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { Activity, ActivityDate, Child, Message } from "@/types/database.types";
import { format, parseISO } from "date-fns";

const ActivityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [activityDates, setActivityDates] = useState<ActivityDate[]>([]);
  const [selectedDate, setSelectedDate] = useState<ActivityDate | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    fetchActivityDetails();
    if (user) {
      fetchChildren();
      fetchMessages();
    }
  }, [id, user]);

  const fetchActivityDetails = async () => {
    try {
      if (!id) return;

      const { data: activityData, error: activityError } = await supabase
        .from("activities")
        .select(`
          *,
          provider:profiles!provider_id(
            id,
            full_name,
            avatar_url,
            phone,
            role
          )
        `)
        .eq('id', id)
        .maybeSingle();

      if (activityError) throw activityError;

      if (!activityData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const formattedActivity: Activity = {
        ...activityData,
        duration: String(activityData.duration),
        provider: activityData.provider ? {
          ...activityData.provider,
          role: activityData.provider.role as 'parent' | 'provider',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } : undefined
      };

      setActivity(formattedActivity);

      const { data: datesData, error: datesError } = await supabase
        .from("activity_dates")
        .select("*")
        .eq("activity_id", id)
        .gt("start_time", new Date().toISOString())
        .order("start_time");

      if (datesError) throw datesError;
      setActivityDates(datesData);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchChildren = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("children")
        .select("*")
        .eq("parent_id", user.id);

      if (error) throw error;
      setChildren(data);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const fetchMessages = async () => {
    if (!user || !activity) return;
    
    try {
      const { data, error } = await supabase
        .from("messages")
        .select(`
          id,
          sender_id,
          receiver_id,
          booking_id,
          content,
          read,
          created_at,
          updated_at,
          sender:profiles!sender_id(
            id,
            full_name,
            avatar_url,
            phone,
            role,
            created_at,
            updated_at
          ),
          receiver:profiles!receiver_id(
            id,
            full_name,
            avatar_url,
            phone,
            role,
            created_at,
            updated_at
          )
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .eq("receiver_id", activity.provider_id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        const typedMessages: Message[] = data.map(msg => ({
          ...msg,
          sender: {
            ...msg.sender,
            role: msg.sender.role as 'parent' | 'provider'
          },
          receiver: {
            ...msg.receiver,
            role: msg.receiver.role as 'parent' | 'provider'
          }
        }));
        setMessages(typedMessages);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleBook = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!selectedDate || !selectedChild) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a date and child for the booking.",
      });
      return;
    }

    try {
      const { error } = await supabase.from("bookings").insert({
        user_id: user.id,
        activity_date_id: selectedDate.id,
        child_id: selectedChild,
        booking_date: new Date().toISOString(),
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Booking submitted successfully!",
      });
      
      setShowBookingDialog(false);
      fetchActivityDetails();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleSendMessage = async () => {
    if (!user || !activity || !message.trim()) return;

    try {
      const { error } = await supabase.from("messages").insert({
        sender_id: user.id,
        receiver_id: activity.provider_id,
        content: message.trim(),
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Message sent successfully!",
      });
      
      setMessage("");
      setShowMessageDialog(false);
      fetchMessages();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Activity not found</h1>
        <p className="text-muted-foreground mb-4">The activity you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="text-primary hover:underline">
          Return to home
        </Link>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Error loading activity</h1>
        <Link to="/" className="text-primary hover:underline">
          Return to home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-12">
      <div className="relative h-[40vh] bg-accent">
        <img 
          src={activity.image_url || "https://images.unsplash.com/photo-1472396961693-142e6e269027"}
          alt={activity.title}
          className="w-full h-full object-cover opacity-50"
        />
        <Link
          to="/"
          className="absolute top-4 left-4 text-white hover:text-white/80"
        >
          <Button variant="ghost" className="text-white hover:text-white/80">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Activities
          </Button>
        </Link>
      </div>

      <div className="container max-w-6xl mx-auto -mt-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border border-muted">
                  <img
                    src={activity.provider?.avatar_url || "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b"}
                    alt={activity.provider?.full_name || "Provider"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <Badge variant="secondary" className="mb-2">
                    Ages {activity.age_range}
                  </Badge>
                  <h1 className="text-2xl font-bold">{activity.title}</h1>
                  <p className="text-muted-foreground">{activity.provider?.full_name}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{activity.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{activity.capacity} capacity</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{activity.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <span>{activity.category}</span>
                </div>
              </div>
            </div>

            <Tabs defaultValue="description" className="bg-white rounded-xl shadow-lg">
              <TabsList className="w-full border-b">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="dates">Available Dates</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="p-6">
                <h3 className="text-lg font-semibold mb-4">About the Activity</h3>
                <p className="text-muted-foreground">{activity.description}</p>
              </TabsContent>
              
              <TabsContent value="dates" className="p-6">
                <div className="space-y-4">
                  {activityDates.length === 0 ? (
                    <p className="text-muted-foreground">No upcoming dates available.</p>
                  ) : (
                    activityDates.map((date) => (
                      <div key={date.id} className="flex items-center justify-between border-b pb-4">
                        <div>
                          <p className="font-medium">{format(parseISO(date.start_time), "PPP")}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(parseISO(date.start_time), "p")} - {date.spots_left} spots left
                          </p>
                        </div>
                        <Button
                          onClick={() => {
                            setSelectedDate(date);
                            setShowBookingDialog(true);
                          }}
                          disabled={date.spots_left === 0}
                        >
                          Book Now
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="messages" className="p-6">
                {user ? (
                  <>
                    <div className="space-y-4 mb-6">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex gap-4 ${
                            msg.sender_id === user.id ? "flex-row-reverse" : ""
                          }`}
                        >
                          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                            <img
                              src={msg.sender?.avatar_url || "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b"}
                              alt={msg.sender?.full_name || "User"}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div
                            className={`rounded-lg p-3 max-w-[80%] ${
                              msg.sender_id === user.id
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <p className="text-sm font-medium mb-1">
                              {msg.sender?.full_name}
                            </p>
                            <p className="text-sm">{msg.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {format(parseISO(msg.created_at), "Pp")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={() => setShowMessageDialog(true)}
                      className="w-full"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-4">
                      Please log in to send messages to the provider.
                    </p>
                    <Button onClick={() => navigate("/login")}>Log In</Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <p className="text-2xl font-bold text-primary mb-4">
                ${activity.price}
                <span className="text-sm text-muted-foreground font-normal"> per child</span>
              </p>
              
              <div className="space-y-4">
                <Button 
                  className="w-full"
                  onClick={() => setShowBookingDialog(true)}
                >
                  Book Now
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowMessageDialog(true)}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Provider
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="font-semibold mb-4">Location</h3>
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">{activity.location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Activity</DialogTitle>
            <DialogDescription>
              Select a child and confirm your booking
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {!user ? (
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
                        onValueChange={setSelectedChild}
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
                      onClick={handleBook}
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

      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Message</DialogTitle>
            <DialogDescription>
              Send a message to the activity provider
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {!user ? (
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
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    rows={4}
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                >
                  Send Message
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActivityDetail;
