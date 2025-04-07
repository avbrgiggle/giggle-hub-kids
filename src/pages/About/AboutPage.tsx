
import { ArrowRight, Book, GraduationCap, Heart, Target, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MainNavigation } from "@/components/MainNavigation";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <MainNavigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">Our Story</h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mb-10">
              Learn about our journey, mission, and the values that drive us to connect families with enriching activities.
            </p>
          </div>
        </div>
      </section>

      {/* Our Beginning */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">How We Started</h2>
              <p className="text-gray-600 mb-4">
                Allegrow began in 2023 when a group of parents experienced firsthand the challenge of finding quality 
                activities for their children. What started as a simple spreadsheet shared among friends quickly grew 
                into a community-driven platform.
              </p>
              <p className="text-gray-600">
                Our founders, all parents themselves, understood the importance of enriching activities in a child's 
                development. They also recognized the difficulty in discovering, evaluating, and booking these 
                experiences. This personal struggle inspired the creation of Allegrow - a platform designed to make 
                quality childhood activities accessible to all families.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-32 w-32 text-primary opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission & Vision</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              We're driven by a clear purpose and forward-looking vision that guides everything we do.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="mb-4">
                <Target className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To connect families with high-quality, enriching activities that foster children's growth, 
                creativity, and joy while supporting dedicated providers who make these experiences possible.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="mb-4">
                <GraduationCap className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-gray-600">
                A world where every child has access to diverse, meaningful activities that nurture their unique 
                talents and interests, supported by a thriving community of passionate activity providers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              These core principles guide our decisions and shape our culture.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Child-Centered</h3>
              <p className="text-gray-600">
                We put children's well-being, growth, and joy at the center of everything we do.
              </p>
            </div>

            <div className="bg-purple-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Community</h3>
              <p className="text-gray-600">
                We foster meaningful connections between families, providers, and the broader community.
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Book className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Quality</h3>
              <p className="text-gray-600">
                We uphold high standards and celebrate providers who deliver exceptional activities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Become a part of our growing community of families and providers passionate about enriching children's lives.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="px-8">
              <Link to="/signup">Sign Up as a Parent</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/partner-with-us">Partner With Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
