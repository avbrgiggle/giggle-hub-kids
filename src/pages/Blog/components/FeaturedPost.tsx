
import { Link } from "react-router-dom";
import { CalendarIcon } from "lucide-react";
import { BlogPost } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FeaturedPostProps {
  post: BlogPost;
}

export function FeaturedPost({ post }: FeaturedPostProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl overflow-hidden shadow-sm">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="h-full">
          <img 
            src={post.imageSrc} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-8 flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-3">
            <Badge variant="secondary">{post.category}</Badge>
            <div className="flex items-center text-gray-500 text-sm">
              <CalendarIcon className="h-3 w-3 mr-1" />
              <span>{post.date}</span>
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{post.title}</h2>
          <p className="text-gray-600 mb-6">{post.excerpt}</p>
          <div className="flex items-center gap-4 mb-6">
            <img 
              src={post.author.avatar} 
              alt={post.author.name} 
              className="h-10 w-10 rounded-full"
            />
            <div>
              <p className="font-medium">{post.author.name}</p>
              <p className="text-sm text-gray-500">{post.author.role}</p>
            </div>
          </div>
          <Button asChild className="self-start">
            <Link to={`/blog/${post.slug}`}>Read Article</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
