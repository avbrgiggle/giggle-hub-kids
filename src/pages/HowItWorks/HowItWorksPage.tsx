import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Calendar, CreditCard, Info, MessageSquare, Search, Users } from "lucide-react";
import { FAQ } from "./components/FAQ";
import { faqs } from "./data/faqs";
import { MainNavigation } from "@/components/MainNavigation";

export default function HowItWorksPage() {
  const [question, setQuestion] = useState("");

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the submission logic
    alert(`Your question "${question}" has been submitted. We'll get back to you soon!`);
    setQuestion("");
  };

  return (
    <div className="min-h-screen bg-white">
      <MainNavigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">How Allegrow Works</h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mb-10">
              Discover how easy it is to find, book, and enjoy quality activities for your children using our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link to="/signup">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="#platform-tour">See How It Works</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Tour */}
      <section id="platform-tour" className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-16">Three Simple Steps</h2>
          
          <div className="space-y-24">
            {/* Step 1: Search */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="p-1 bg-gray-100 rounded-xl">
                  <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" 
                      alt="Parent and child searching for activities together" 
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="inline-block bg-primary/10 text-primary font-medium rounded-full px-4 py-1 text-sm mb-4">
                  Step 1
                </div>
                <h3 className="text-2xl font-bold mb-4">Search & Discover Activities</h3>
                <p className="text-gray-600 mb-4">
                  Find the perfect activities for your children by searching based on:
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <Search className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Activity type (sports, arts, music, education)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Search className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Location and distance from your home</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Search className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Age range appropriate for your child</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Search className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Schedule and availability</span>
                  </li>
                </ul>
                <p className="text-gray-600">
                  Our smart filters help you find exactly what you're looking for, with verified reviews from other parents.
                </p>
              </div>
            </div>
            
            {/* Step 2: Book */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block bg-primary/10 text-primary font-medium rounded-full px-4 py-1 text-sm mb-4">
                  Step 2
                </div>
                <h3 className="text-2xl font-bold mb-4">Book & Communicate</h3>
                <p className="text-gray-600 mb-4">
                  Once you've found the perfect activity:
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Select available dates and times that work for you</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Users className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Register your child's information securely</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MessageSquare className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Ask questions directly to the activity provider</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Review all activity details and requirements</span>
                  </li>
                </ul>
                <p className="text-gray-600">
                  Our messaging system makes it easy to communicate directly with providers before, during, and after booking.
                </p>
              </div>
              <div>
                <div className="p-1 bg-gray-100 rounded-xl">
                  <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7" 
                      alt="Parent booking an activity on a tablet" 
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Step 3: Pay */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="p-1 bg-gray-100 rounded-xl">
                  <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1498050108023-c5249f4df085" 
                      alt="Secure payment process interface" 
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="inline-block bg-primary/10 text-primary font-medium rounded-full px-4 py-1 text-sm mb-4">
                  Step 3
                </div>
                <h3 className="text-2xl font-bold mb-4">Pay & Enjoy</h3>
                <p className="text-gray-600 mb-4">
                  Complete your booking with our secure payment system:
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <CreditCard className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Multiple payment methods (credit card, PayPal)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CreditCard className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Secure, encrypted transactions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CreditCard className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Transparent pricing with no hidden fees</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CreditCard className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Booking confirmation and receipts</span>
                  </li>
                </ul>
                <p className="text-gray-600">
                  All bookings come with our satisfaction guarantee. If an activity doesn't meet the described standards, we'll work with you to make it right.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-6">Frequently Asked Questions</h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Find answers to common questions about using our platform.
          </p>
          
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq) => (
                <FAQ key={faq.id} question={faq.question} answer={faq.answer} />
              ))}
            </Accordion>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-8">
              Don't see your question here? Ask us directly and we'll get back to you.
            </p>
            <form onSubmit={handleSubmitQuestion} className="max-w-md mx-auto space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question">Your Question</Label>
                <Input 
                  id="question" 
                  placeholder="Type your question here..." 
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">Submit Question</Button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Find Perfect Activities?</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Join thousands of families who are discovering and booking amazing activities for their children.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="px-8">
              <Link to="/signup">Create an Account</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/">Browse Activities <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
