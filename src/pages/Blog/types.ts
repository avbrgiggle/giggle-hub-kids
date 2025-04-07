
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageSrc: string;
  date: string;
  category: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
}
