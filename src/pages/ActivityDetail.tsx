
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
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
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";

const ActivityDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>();

  // Simulated activity data (in a real app, this would come from an API)
  const activity = {
    id: 1,
    title: "Kids Art & Craft Workshop",
    description: "Fun creative workshop where kids can explore their artistic side through various art mediums including painting, drawing, and crafts. Professional instructors guide children through age-appropriate projects that enhance creativity and fine motor skills.",
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
    companyLogo: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b",
    companyName: "Creative Kids Co",
    companyDescription: "Creative Kids Co has been nurturing young artists since 2015. Our team of experienced art educators is passionate about introducing children to the world of art in a fun and engaging way.",
    ageRange: "5-12",
    price: 25,
    duration: "2 hours",
    location: "Creative Studio, 123 Art Street, Downtown",
    category: "Arts & Crafts",
    rating: 4.8,
    reviews: [
      { id: 1, user: "Sarah M.", rating: 5, comment: "My daughter loved the workshop! The instructors were patient and encouraging." },
      { id: 2, user: "John D.", rating: 4, comment: "Great experience, would recommend to other parents." }
    ],
    totalBookings: 156,
    coordinates: { lat: 40.7128, lng: -74.0060 }, // Example coordinates
    terms: "Cancellations must be made 24 hours in advance for a full refund. No refunds for no-shows or late cancellations.",
    capacity: 12,
    remainingSpots: 5
  };

  const handleBook = () => {
    toast({
      title: "Booking Initiated",
      description: "Booking functionality coming soon!",
    });
  };

  const handleContactProvider = () => {
    toast({
      title: "Contact Request Sent",
      description: "The activity provider will get back to you soon!",
    });
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-12">
      {/* Header Image */}
      <div className="relative h-[40vh] bg-accent">
        <img 
          src={activity.image} 
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

      {/* Content */}
      <div className="container max-w-6xl mx-auto -mt-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Activity Header */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border border-muted">
                  <img
                    src={activity.companyLogo}
                    alt={activity.companyName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <Badge variant="secondary" className="mb-2">
                    Ages {activity.ageRange}
                  </Badge>
                  <h1 className="text-2xl font-bold">{activity.title}</h1>
                  <p className="text-muted-foreground">{activity.companyName}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{activity.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{activity.remainingSpots} spots left</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-primary" />
                  <span>{activity.rating} ({activity.reviews.length} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <span>{activity.totalBookings} bookings</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="description" className="bg-white rounded-xl shadow-lg">
              <TabsList className="w-full border-b">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="company">Company</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="terms">Terms & Conditions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="p-6">
                <h3 className="text-lg font-semibold mb-4">About the Activity</h3>
                <p className="text-muted-foreground">{activity.description}</p>
              </TabsContent>
              
              <TabsContent value="company" className="p-6">
                <h3 className="text-lg font-semibold mb-4">About {activity.companyName}</h3>
                <p className="text-muted-foreground">{activity.companyDescription}</p>
              </TabsContent>
              
              <TabsContent value="reviews" className="p-6">
                <div className="space-y-4">
                  {activity.reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-primary" />
                        <span className="font-semibold">{review.rating}/5</span>
                        <span className="text-muted-foreground">by {review.user}</span>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="terms" className="p-6">
                <h3 className="text-lg font-semibold mb-4">Terms & Cancellation Policy</h3>
                <p className="text-muted-foreground">{activity.terms}</p>
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <p className="text-2xl font-bold text-primary mb-4">
                ${activity.price}
                <span className="text-sm text-muted-foreground font-normal"> per person</span>
              </p>
              
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Select Date</h3>
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </div>

              <Button className="w-full mb-4" onClick={handleBook}>
                Book Now
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleContactProvider}
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact Provider
              </Button>
            </div>

            {/* Location Card */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="font-semibold mb-4">Location</h3>
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">{activity.location}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Map integration coming soon!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetail;
