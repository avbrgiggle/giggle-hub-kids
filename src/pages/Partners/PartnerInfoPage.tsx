
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Check, ChevronDown, DollarSign, Map, MessageSquare, Search, ShieldCheck, Users } from "lucide-react";
import { MainNavigation } from "@/components/MainNavigation";

export default function PartnerInfoPage() {
  return (
    <div className="min-h-screen bg-white">
      <MainNavigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">Join Our Network of Activity Providers</h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mb-10">
              Partner with us to reach more families, simplify your booking process, and grow your business while making a positive impact on children's lives.
            </p>
            <Button asChild size="lg" className="px-8">
              <Link to="/partner-with-us">Become a Partner</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Partner With Us */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-16">Why Partner With Us</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Increased Visibility</h3>
              <p className="text-gray-600">
                Get discovered by thousands of families actively searching for activities like yours in their local area.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Simplified Booking</h3>
              <p className="text-gray-600">
                Our platform handles the booking process, allowing you to focus on delivering exceptional experiences.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Direct Communication</h3>
              <p className="text-gray-600">
                Connect directly with parents through our messaging system to answer questions and build relationships.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fair Pricing</h3>
              <p className="text-gray-600">
                Transparent fee structure with competitive rates, designed to help your business grow sustainably.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Status</h3>
              <p className="text-gray-600">
                Stand out with our verification badge, building trust and credibility with potential customers.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Map className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Targeted Reach</h3>
              <p className="text-gray-600">
                Connect with families specifically looking for your type of activity in your geographic area.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="relative text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Apply</h3>
              <p className="text-gray-600">
                Complete our simple application form with details about your activities.
              </p>
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-200 -z-10"></div>
            </div>
            
            <div className="relative text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Verified</h3>
              <p className="text-gray-600">
                Our team reviews your application and verifies your business.
              </p>
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-200 -z-10"></div>
            </div>
            
            <div className="relative text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Listings</h3>
              <p className="text-gray-600">
                Set up your activities with details, photos, schedules and pricing.
              </p>
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-200 -z-10"></div>
            </div>
            
            <div className="relative text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Start Growing</h3>
              <p className="text-gray-600">
                Receive bookings, manage your schedule, and connect with families.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-8">Partner Testimonials</h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Hear from activity providers who have joined our platform and experienced growth.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex flex-col h-full">
                <p className="text-gray-600 mb-6 flex-grow">
                  "Since joining Allegrow, our enrollment has increased by 35%. The platform makes it easy for parents to discover our art classes, and the booking system has simplified our administrative work tremendously."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                    <img src="/placeholder.svg" alt="Sarah's Art Studio" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold">Sarah Johnson</p>
                    <p className="text-sm text-gray-500">Sarah's Art Studio</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex flex-col h-full">
                <p className="text-gray-600 mb-6 flex-grow">
                  "The Allegrow platform has been instrumental in helping us expand to new neighborhoods. Parents trust the platform, which has helped us build credibility and grow our sports coaching business faster than we could have on our own."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                    <img src="/placeholder.svg" alt="Active Kids Sports" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold">Michael Torres</p>
                    <p className="text-sm text-gray-500">Active Kids Sports</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-12">Common Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <button className="flex justify-between items-center w-full text-left">
                <h3 className="text-xl font-semibold">What types of activities can join the platform?</h3>
                <ChevronDown className="h-5 w-5 text-gray-500" />
              </button>
              <div className="mt-4 text-gray-600">
                <p>
                  We welcome a wide range of children's activities, including sports, arts and crafts, music lessons, educational programs, dance, science workshops, nature programs, and more. Any activity that contributes positively to children's development and well-being is welcome to apply.
                </p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <button className="flex justify-between items-center w-full text-left">
                <h3 className="text-xl font-semibold">What are the fees for using the platform?</h3>
                <ChevronDown className="h-5 w-5 text-gray-500" />
              </button>
              <div className="mt-4 text-gray-600">
                <p>
                  Our fee structure is transparent and competitive. We charge a small percentage of each successful booking, with no upfront or monthly fees. This ensures we only earn when you do. The exact percentage varies based on your activity type and volume.
                </p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <button className="flex justify-between items-center w-full text-left">
                <h3 className="text-xl font-semibold">How long does the verification process take?</h3>
                <ChevronDown className="h-5 w-5 text-gray-500" />
              </button>
              <div className="mt-4 text-gray-600">
                <p>
                  The verification process typically takes 3-5 business days. We review your application carefully to ensure all providers on our platform meet our quality and safety standards. You'll receive regular updates on your application status.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Link to="/partner-with-us" className="text-primary font-medium hover:underline inline-flex items-center">
              View all FAQs
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-primary/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Grow Your Activity Business?</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Join our community of trusted activity providers and connect with families looking for exactly what you offer.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="px-8">
              <Link to="/partner-with-us">Apply to Join</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">Have Questions?</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
