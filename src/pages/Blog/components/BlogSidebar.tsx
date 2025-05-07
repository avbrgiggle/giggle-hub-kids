
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { blogCategories } from "../data/blogCategories";

export function BlogSidebar() {
  return (
    <div className="space-y-8">
      {/* Newsletter */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-bold mb-4">Subscribe to Our Newsletter</h3>
        <p className="text-gray-600 text-sm mb-4">
          Get the latest articles, resources and updates right to your inbox.
        </p>
        <div className="space-y-3">
          <Input placeholder="Your email address" />
          <Button className="w-full">
            <Mail className="h-4 w-4 mr-2" />
            Subscribe
          </Button>
        </div>
      </div>
      
      {/* Categories */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-bold mb-4">Categories</h3>
        <ul className="space-y-2">
          {blogCategories.map((category) => (
            <li key={category.id}>
              <Link 
                to={`/blog/category/${category.slug}`}
                className="text-gray-600 hover:text-primary flex justify-between items-center group"
              >
                <span className="group-hover:underline">{category.name}</span>
                <span className="text-sm text-gray-400">{category.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Popular Posts */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-bold mb-4">Popular Posts</h3>
        <ul className="space-y-4">
          <li>
            <Link to="/blog/summer-activities-guide" className="flex gap-3 group">
              <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1596464716127-f2a82984de30" 
                  alt="Summer activities guide" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium group-hover:text-primary group-hover:underline transition-colors line-clamp-2">
                  Summer Activities Guide for Children
                </h4>
                <p className="text-sm text-gray-500">June 15, 2024</p>
              </div>
            </Link>
          </li>
          <li>
            <Link to="/blog/choosing-the-right-activity" className="flex gap-3 group">
              <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1544717302-de2939b7ef71" 
                  alt="Choosing the right activity" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <h4 className="font-medium group-hover:text-primary group-hover:underline transition-colors line-clamp-2">
                  How to Choose the Right Activity for Your Child
                </h4>
                <p className="text-sm text-gray-500">May 22, 2024</p>
              </div>
            </Link>
          </li>
          <li>
            <Link to="/blog/benefits-of-extracurricular" className="flex gap-3 group">
              <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1602030028438-4cf153cbae9e" 
                  alt="Benefits of extracurricular" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium group-hover:text-primary group-hover:underline transition-colors line-clamp-2">
                  5 Benefits of Extracurricular Activities
                </h4>
                <p className="text-sm text-gray-500">May 8, 2024</p>
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
