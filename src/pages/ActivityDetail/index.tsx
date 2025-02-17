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
import type { Activity, ActivityDate, Child, Message, Profile } from "@/types/database.types";
import { format, parseISO } from "date-fns";
import { ActivityHeader } from "./components/ActivityHeader";
import { BookingDialog } from "./components/BookingDialog";
import { MessageDialog } from "./components/MessageDialog";
import { MessageList } from "./components/MessageList";

const ActivityDetail = () => {
  const { id } = useParams();
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

  useEffect(() => {
    fetchActivityDetails();
    if (user) {
      fetchChildren();
      fetchMessages();
    }
  }, [id, user]);

  const fetchActivityDetails = async () => {
    try {
      const { data: activityData, error: activityError } = await supabase
        .from("activities")
        .select(`
          id,
          provider_id,
          title,
          description,
          image_url,
          location,
          category,
          age_range,
          capacity,
          price,
          duration,
          created_at,
          updated_at,
          provider:profiles!provider_id(
            id,
            full_name,
            avatar_url,
            phone,
            role
          )
        `)
        .eq("id", id)
        .single();

      if (activityError) throw activityError;

      if (activityData) {
        const provider = activityData.provider as Profile;
        const activity: Activity = {
          ...activityData,
          duration: String(activityData.duration),
          provider: {
            ...provider,
            role: provider.role as 'parent' | 'provider',
            created_at: provider.created_at || '',
            updated_at: provider.updated_at || ''
          }
        };
        setActivity(activity);
      } else {
        setActivity(null);
      }

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

  if (!activity) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Activity not found</h1>
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
            <ActivityHeader activity={activity} />

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
                <MessageList
                  messages={messages}
                  currentUserId={user?.id}
                  isAuthenticated={!!user}
                  onNewMessage={() => setShowMessageDialog(true)}
                />
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

      <BookingDialog
        open={showBookingDialog}
        onOpenChange={setShowBookingDialog}
        children={children}
        selectedDate={selectedDate}
        selectedChild={selectedChild}
        onChildChange={setSelectedChild}
        onBook={handleBook}
        isAuthenticated={!!user}
      />

      <MessageDialog
        open={showMessageDialog}
        onOpenChange={setShowMessageDialog}
        message={message}
        onMessageChange={setMessage}
        onSend={handleSendMessage}
        isAuthenticated={!!user}
      />
    </div>
  );
};

export default ActivityDetail;
