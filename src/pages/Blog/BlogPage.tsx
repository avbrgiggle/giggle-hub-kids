
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { BlogPostCard } from "./components/BlogPostCard";
import { FeaturedPost } from "./components/FeaturedPost";
import { BlogSidebar } from "./components/BlogSidebar";
import { blogPosts } from "./data/blogPosts";
import { MainNavigation } from "@/components/MainNavigation";

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredPosts = blogPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const featuredPost = blogPosts[0]; // Using the first post as featured

  return (
    <div className="min-h-screen bg-white">
      <MainNavigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Our Blog</h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mb-8">
              Insights, tips, and stories about children's activities, development, and parenting.
            </p>
            <div className="w-full max-w-md relative">
              <Input
                placeholder="Search articles..."
                className="pr-10 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold mb-8">Featured Article</h2>
          <FeaturedPost post={featuredPost} />
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="lg:w-2/3">
              <h2 className="text-2xl font-bold mb-8">Recent Articles</h2>
              
              {filteredPosts.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredPosts.slice(1).map((post) => (
                    <BlogPostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <p className="text-gray-500">No articles found matching your search criteria.</p>
                  <Button 
                    variant="link" 
                    onClick={() => setSearchTerm("")}
                    className="mt-2"
                  >
                    Clear search
                  </Button>
                </div>
              )}
              
              {/* Pagination */}
              <div className="flex justify-center mt-12">
                <Button variant="outline" className="mx-1" disabled>Previous</Button>
                <Button variant="default" className="mx-1">1</Button>
                <Button variant="outline" className="mx-1">2</Button>
                <Button variant="outline" className="mx-1">3</Button>
                <Button variant="outline" className="mx-1">Next</Button>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:w-1/3 mt-8 lg:mt-0">
              <BlogSidebar />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
