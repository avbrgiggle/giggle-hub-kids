
import { useState } from "react";
import { Search, MapPin, Filter, Heart, Star } from "lucide-react";
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
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
            Discover Amazing Activities for Kids
          </h1>
          <p className="text-lg text-center text-muted-foreground mb-8">
            Find and book the perfect activities for your children
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto flex gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                className="pl-10 h-12 rounded-full"
              />
            </div>
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Location..."
                className="pl-10 h-12 rounded-full"
              />
            </div>
            <Button size="lg" className="rounded-full h-12">
              <Filter className="mr-2" />
              Filters
            </Button>
          </div>

          {/* Age Range Slider */}
          <div className="max-w-md mx-auto">
            <p className="text-center mb-2">Age Range: {ageRange[0]} - {ageRange[1]} years</p>
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
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      Ages {activity.ageRange}
                    </Badge>
                    <h3 className="text-lg font-semibold">{activity.title}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">
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
                    <Star className="w-4 h-4 text-yellow-400" />
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
