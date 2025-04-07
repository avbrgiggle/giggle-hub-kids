
import { Link } from "react-router-dom";
import { CalendarIcon } from "lucide-react";
import { BlogPost } from "../types";
import { Badge } from "@/components/ui/badge";

interface BlogPostCardProps {
  post: BlogPost;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm transition-all hover:shadow-md">
      <Link to={`/blog/${post.slug}`}>
        <div className="aspect-w-16 aspect-h-9 bg-gray-100">
          <img 
            src={post.imageSrc} 
            alt={post.title} 
            className="w-full h-48 object-cover"
          />
        </div>
      </Link>
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <Badge variant="secondary">{post.category}</Badge>
          <div className="flex items-center text-gray-500 text-sm">
            <CalendarIcon className="h-3 w-3 mr-1" />
            <span>{post.date}</span>
          </div>
        </div>
        <Link to={`/blog/${post.slug}`}>
          <h3 className="text-xl font-bold mb-2 hover:text-primary transition-colors">{post.title}</h3>
        </Link>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src={post.author.avatar} 
              alt={post.author.name} 
              className="h-8 w-8 rounded-full mr-2"
            />
            <span className="text-sm font-medium">{post.author.name}</span>
          </div>
          <Link to={`/blog/${post.slug}`} className="text-primary text-sm font-medium hover:underline">
            Read more
          </Link>
        </div>
      </div>
    </div>
  );
}
