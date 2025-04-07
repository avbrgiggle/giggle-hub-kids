
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Award,
  Users, 
  BadgePercent, 
  GraduationCap, 
  HandshakeIcon, 
  Calendar, 
  LucideBarChart,
  Shield
} from "lucide-react";
import { MainNavigation } from "@/components/MainNavigation";

export default function PartnerWithUs() {
  return (
    <div className="min-h-screen bg-white">
      <MainNavigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">Partner With Us</h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mb-10">
              Join our platform to showcase your activities and connect with parents looking for quality experiences for their children.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="px-8">
                <Link to="/signup?tab=provider-request">Apply to Join</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/login">Already a Partner?</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-12">Our Mission</h2>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <p className="text-lg text-gray-700 mb-6">
                We believe every child deserves access to quality extracurricular activities that nurture their talents, 
                creativity, and personal growth. Our platform bridges the gap between parents seeking enriching experiences 
                for their children and quality providers like you.
              </p>
              <p className="text-lg text-gray-700">
                By joining our community, you'll help us create a world where children can discover and develop their 
                passions through diverse, accessible, and high-quality activities.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="bg-blue-50 p-8 rounded-2xl">
                <HandshakeIcon className="h-32 w-32 text-primary mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-4">Why Partner With Us</h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Joining our platform offers numerous advantages to help grow your business and connect with more families.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="bg-blue-50 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expanded Reach</h3>
              <p className="text-gray-600">
                Connect with thousands of parents actively searching for activities for their children.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="bg-blue-50 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <LucideBarChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Business Growth</h3>
              <p className="text-gray-600">
                Increase enrollment and build a sustainable business with our marketing support.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="bg-blue-50 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Simplified Management</h3>
              <p className="text-gray-600">
                Our tools help you manage bookings, attendance, and communications efficiently.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="bg-blue-50 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <BadgePercent className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Competitive Fees</h3>
              <p className="text-gray-600">
                Fair and transparent pricing structure that helps you maximize your earnings.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="bg-blue-50 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Trust & Credibility</h3>
              <p className="text-gray-600">
                Gain credibility by being part of our vetted community of quality providers.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="bg-blue-50 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Meaningful Impact</h3>
              <p className="text-gray-600">
                Help shape the next generation by providing valuable skills and experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative mb-6">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-200 -z-10"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Apply</h3>
              <p className="text-gray-600">
                Submit your application with details about your activities and business.
              </p>
            </div>
            
            <div className="text-center">
              <div className="relative mb-6">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-200 -z-10"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Verified</h3>
              <p className="text-gray-600">
                Our team reviews your application and approves your provider account.
              </p>
            </div>
            
            <div className="text-center">
              <div className="relative mb-6">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Start Growing</h3>
              <p className="text-gray-600">
                Create listings, manage bookings, and connect with parents seeking your services.
              </p>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Button asChild size="lg" className="px-10">
              <Link to="/signup?tab=provider-request">Apply Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-12">Provider Success Stories</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <Award className="h-6 w-6 text-yellow-500 mr-2" />
                <h3 className="text-lg font-semibold">Sarah's Art Studio</h3>
              </div>
              <p className="text-gray-600 mb-4">
                "Since joining the platform, we've seen a 40% increase in enrollment for our art classes. 
                The booking system has saved us hours of administrative work, and we love connecting with families 
                who truly value creative education."
              </p>
              <p className="font-medium">Sarah J. - Art Instructor</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <Award className="h-6 w-6 text-yellow-500 mr-2" />
                <h3 className="text-lg font-semibold">Active Kids Sports</h3>
              </div>
              <p className="text-gray-600 mb-4">
                "The platform has been instrumental in helping us expand to three new locations. 
                Parents trust the platform, which has helped us build credibility in new neighborhoods 
                faster than we could have on our own."
              </p>
              <p className="font-medium">Michael T. - Sports Coach</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-primary/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Grow Your Activity Business?</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Join our community of trusted providers and connect with families looking for exactly what you offer.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="px-8">
              <Link to="/signup?tab=provider-request">Apply to Join</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/login">Already a Partner?</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
