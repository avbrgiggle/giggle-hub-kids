import { useState } from "react";
import { Link } from "react-router-dom";
import { MainNavigation } from "@/components/MainNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { 
  Search, 
  Users, 
  Calendar, 
  Star, 
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Shield,
  Heart
} from "lucide-react";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    // TODO: Implement newsletter subscription logic
    setTimeout(() => {
      toast({
        title: "Success!",
        description: "You've been added to our newsletter. Stay tuned!",
      });
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNavigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-secondary py-24 md:py-40">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4 animate-fade-in">
              <h1 className="text-5xl md:text-7xl font-luckiest text-primary-foreground tracking-wider">
                ALLEGROW
              </h1>
              <div className="h-1 w-24 mx-auto bg-primary-foreground/50 rounded-full" />
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground/95 animate-fade-in leading-tight">
              Discover Amazing Activities for Your Children
            </h2>
            
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto animate-fade-in">
              Connect with trusted providers and find the perfect activities to help your children grow and thrive
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-fade-in">
              <Link to="/activities">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto text-base px-8">
                  <Search className="mr-2 h-5 w-5" />
                  Explore Activities
                </Button>
              </Link>
              <Link to="/partner-with-us">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20">
                  <Users className="mr-2 h-5 w-5" />
                  Partner With Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose Allegrow?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-card p-8 rounded-lg shadow-sm border space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Trusted Providers</h3>
              <p className="text-muted-foreground">
                All activity providers are verified and reviewed by our community
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-lg shadow-sm border space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Easy Booking</h3>
              <p className="text-muted-foreground">
                Book activities in seconds with our simple and intuitive platform
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-lg shadow-sm border space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Quality Activities</h3>
              <p className="text-muted-foreground">
                From sports to arts, science to music - find the perfect fit for your child
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Parents Newsletter Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <Heart className="w-16 h-16 mx-auto opacity-90" />
            <h2 className="text-3xl md:text-4xl font-bold">
              Be the First to Know
            </h2>
            <p className="text-lg opacity-90">
              Subscribe to our newsletter and get exclusive updates on new activities, special offers, and parenting tips
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-primary-foreground text-foreground flex-1"
              />
              <Button 
                type="submit" 
                variant="secondary"
                disabled={isSubmitting}
                className="whitespace-nowrap"
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm opacity-80">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Weekly updates</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Exclusive offers</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Unsubscribe anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Providers Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-6 mb-12">
              <TrendingUp className="w-16 h-16 mx-auto text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold">
                Grow Your Activity Business
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join our platform and connect with families looking for quality activities. Let's schedule a call to discuss how Allegrow can help you grow.
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-lg shadow-sm border space-y-6">
              <h3 className="text-2xl font-semibold text-center">Why Partner With Us?</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Reach More Families</h4>
                    <p className="text-sm text-muted-foreground">Connect with parents actively searching for activities</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Easy Management</h4>
                    <p className="text-sm text-muted-foreground">Manage bookings, payments, and communications in one place</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Marketing Support</h4>
                    <p className="text-sm text-muted-foreground">We help promote your activities to our growing community</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Dedicated Support</h4>
                    <p className="text-sm text-muted-foreground">Get help from our team whenever you need it</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-6 text-center">
                <Link to="/partner-with-us">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get in Touch & Book a Meeting
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <p className="text-sm text-muted-foreground mt-4">
                  Already a partner? <Link to="/login" className="text-primary hover:underline">Sign in here</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div>
              <h4 className="font-semibold mb-4">For Parents</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/activities" className="hover:text-foreground transition-colors">Find Activities</Link></li>
                <li><Link to="/how-it-works" className="hover:text-foreground transition-colors">How It Works</Link></li>
                <li><Link to="/signup" className="hover:text-foreground transition-colors">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Providers</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/partner-with-us" className="hover:text-foreground transition-colors">Partner With Us</Link></li>
                <li><Link to="/partners" className="hover:text-foreground transition-colors">Partner Info</Link></li>
                <li><Link to="/login" className="hover:text-foreground transition-colors">Provider Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
                <li><Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Join our community and stay updated with the latest news and activities.
              </p>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Allegrow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
