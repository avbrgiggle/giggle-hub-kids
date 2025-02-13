
import { useState } from "react";
import { Search, MapPin, Filter, Heart, Star, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const DUMMY_ACTIVITIES = [
  {
    id: 1,
    title: "Kids Art & Craft Workshop",
    description: "Fun creative workshop where kids can explore their artistic side",
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
    companyLogo: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b",
    companyName: "Creative Kids Co",
    ageRange: "5-12",
    price: 25,
    location: "Creative Studio, Downtown",
    category: "Arts & Crafts",
    rating: 4.8,
    reviews: 24,
  },
  {
    id: 2,
    title: "Swimming Lessons for Beginners",
    description: "Professional swimming lessons for children in a safe environment",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    companyLogo: "https://images.unsplash.com/photo-1483058712412-4245e9b90334",
    companyName: "Splash Academy",
    ageRange: "4-15",
    price: 30,
    location: "Splash Pool Center",
    category: "Sports",
    rating: 4.9,
    reviews: 45,
  },
  {
    id: 3,
    title: "Coding for Kids",
    description: "Introduction to programming concepts through fun projects",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    companyLogo: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    companyName: "Tech Kids Lab",
    ageRange: "8-16",
    price: 0,
    location: "Tech Hub Center",
    category: "Education",
    rating: 4.7,
    reviews: 18,
  },
];

const Categories = [
  "All",
  "Sports",
  "Arts & Crafts",
  "Education",
  "Music",
  "Dance",
  "Science",
  "Nature",
];

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [ageRange, setAgeRange] = useState([0, 18]);
  const { toast } = useToast();

  const handleSave = (activityId: number) => {
    toast({
      title: "Activity Saved!",
      description: "You can find this in your saved activities.",
    });
  };

  return (
    <div className="min-h-screen bg-muted/30 animate-fade-in">
      {/* Hero Section */}
      <div className="bg-accent text-white py-16">
        <div className="container">
          <div className="flex flex-col items-center mb-8">
            <div className="w-full flex justify-end mb-4">
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/20"
                onClick={() => toast({
                  title: "Coming Soon",
                  description: "Sign up and login functionality will be available soon!",
                })}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign Up / Log In
              </Button>
            </div>
            <img 
              src="/lovable-uploads/ef0c0ba4-8c77-4009-8669-dec94b2ec9de.png" 
              alt="Allegrow" 
              className="w-96 mb-4"
            />
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto flex gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                className="pl-10 h-12 rounded-full bg-white/90 border-0"
              />
            </div>
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Location..."
                className="pl-10 h-12 rounded-full bg-white/90 border-0"
              />
            </div>
            <Button size="lg" className="rounded-full h-12 bg-primary hover:bg-primary/90">
              <Filter className="mr-2" />
              Filters
            </Button>
          </div>

          {/* Age Range Slider */}
          <div className="max-w-md mx-auto">
            <p className="text-center mb-2 text-white/90">Age Range: {ageRange[0]} - {ageRange[1]} years</p>
            <Slider
              defaultValue={[0, 18]}
              max={18}
              step={1}
              value={ageRange}
              onValueChange={setAgeRange}
              className="my-4"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="container py-8">
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
          {Categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`filter-chip whitespace-nowrap ${
                selectedCategory === category ? "active" : ""
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DUMMY_ACTIVITIES.map((activity) => (
            <div key={activity.id} className="activity-card animate-slide-up">
              <div className="activity-image">
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => handleSave(activity.id)}
                  className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                >
                  <Heart className="w-5 h-5 text-primary" />
                </button>
              </div>
              <div className="activity-content">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-muted flex-shrink-0">
                      <img
                        src={activity.companyLogo}
                        alt={activity.companyName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <Badge variant="secondary" className="mb-1">
                        Ages {activity.ageRange}
                      </Badge>
                      <h3 className="text-lg font-semibold">{activity.title}</h3>
                      <p className="text-xs text-muted-foreground">{activity.companyName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">
                      {activity.price === 0 ? "Free" : `$${activity.price}`}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {activity.description}
                </p>
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {activity.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-primary" />
                    <span className="text-sm">
                      {activity.rating} ({activity.reviews})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
