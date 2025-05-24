
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
  Loader2,
  Heart,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { ShareDialog } from "./components/ShareDialog";

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
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchActivityDetails();
    if (user) {
      fetchChildren();
      fetchMessages();
      checkIfFavorite();
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
            role,
            location
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

  const checkIfFavorite = async () => {
    if (!user || !id) return;
    
    try {
      // Direct SQL query with RPC call to check if the favorite exists
      const { data, error } = await supabase
        .rpc('check_favorite_exists', { 
          p_user_id: user.id, 
          p_activity_id: id 
        });
      
      if (error) {
        console.error("Error checking favorite status:", error);
        return;
      }
      
      setIsFavorite(!!data);
    } catch (error: any) {
      console.error("Error checking favorite status:", error);
    }
  };
  
  const toggleFavorite = async () => {
    if (!user || !id) {
      navigate("/login");
      return;
    }
    
    try {
      if (isFavorite) {
        // Remove from favorites using RPC call
        const { error } = await supabase
          .rpc('remove_favorite', { 
            p_user_id: user.id, 
            p_activity_id: id 
          });
          
        if (error) throw error;
        
        setIsFavorite(false);
        toast({
          title: "Success",
          description: "Removed from favorites",
        });
      } else {
        // Add to favorites using RPC call
        const { error } = await supabase
          .rpc('add_favorite', { 
            p_user_id: user.id, 
            p_activity_id: id 
          });
          
        if (error) throw error;
        
        setIsFavorite(true);
        toast({
          title: "Success",
          description: "Added to favorites",
        });
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
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                {activity.provider && (
                  <Link to={`/partners/${activity.provider_id}`} className="w-16 h-16 rounded-full overflow-hidden border border-muted cursor-pointer">
                    <img
                      src={activity.provider.avatar_url || "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b"}
                      alt={activity.provider.full_name || "Provider"}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                )}
                <div className="flex-1">
                  <Badge variant="secondary" className="mb-2">
                    Ages {activity.age_range}
                  </Badge>
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{activity.title}</h1>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={toggleFavorite}
                      className={`${isFavorite ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-primary'}`}
                    >
                      <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500' : ''}`} />
                    </Button>
                  </div>
                  {activity.provider && (
                    <Link to={`/partners/${activity.provider_id}`} className="text-muted-foreground hover:text-primary">
                      {activity.provider.full_name}
                    </Link>
                  )}
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
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
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
              
              <TabsContent value="location" className="p-6">
                <h3 className="text-lg font-semibold mb-4">Location</h3>
                <p className="text-muted-foreground mb-4">{activity.location}</p>
                <div className="h-[300px] w-full bg-muted flex items-center justify-center rounded-lg border">
                  <p className="text-muted-foreground text-center p-4">
                    Map integration has been temporarily removed. <br />
                    Location: {activity.location}
                  </p>
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
              
              <TabsContent value="reviews" className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Reviews</h3>
                    {user && (
                      <Button variant="outline" size="sm">
                        <Star className="w-4 h-4 mr-2" />
                        Write a Review
                      </Button>
                    )}
                  </div>
                  
                  <div className="text-center py-10">
                    <Star className="w-12 h-12 mx-auto text-muted-foreground/40 mb-2" />
                    <p className="text-muted-foreground">No reviews yet</p>
                    {!user && (
                      <Button 
                        variant="outline"
                        className="mt-4"
                        onClick={() => navigate("/login")}
                      >
                        Log in to write a review
                      </Button>
                    )}
                  </div>
                </div>
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
              <h3 className="font-semibold mb-4">Provider</h3>
              {activity.provider && (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <Link to={`/partners/${activity.provider_id}`} className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={activity.provider.avatar_url || "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b"}
                        alt={activity.provider.full_name || "Provider"}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    <div>
                      <Link to={`/partners/${activity.provider_id}`} className="font-medium hover:text-primary">
                        {activity.provider.full_name}
                      </Link>
                      <p className="text-sm text-muted-foreground">{activity.provider.location}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This provider offers various activities for children.
                  </p>
                  <Button 
                    variant="link" 
                    className="px-0 mt-2"
                    asChild
                  >
                    <Link to={`/partners/${activity.provider_id}`}>
                      View all activities
                    </Link>
                  </Button>
                </>
              )}
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="font-semibold mb-4">Share this activity</h3>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={() => setShowShareDialog(true)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full text-blue-600"
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')}
                >
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full text-pink-600"
                  onClick={() => window.open(`https://www.instagram.com/`, '_blank')}
                >
                  <Instagram className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full text-green-600"
                  onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Check out this activity: ${activity.title} at ${window.location.href}`)}`, '_blank')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                  </svg>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full text-purple-600"
                  onClick={() => window.open(`mailto:?subject=Check out this activity&body=${activity.title} - ${window.location.href}`, '_blank')}
                >
                  <Mail className="h-4 w-4" />
                </Button>
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
      
      <ShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        activityTitle={activity.title}
        activityUrl={window.location.href}
      />
    </div>
  );
};

export default ActivityDetail;
