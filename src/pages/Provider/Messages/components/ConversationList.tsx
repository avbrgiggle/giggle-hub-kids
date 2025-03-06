
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ChevronRight, Search, UserPlus } from "lucide-react";

interface ConversationListProps {
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filteredConversations: any[];
  activeConversation: string | null;
  handleOpenConversation: (id: string) => void;
}

export default function ConversationList({
  loading,
  searchQuery,
  setSearchQuery,
  filteredConversations,
  activeConversation,
  handleOpenConversation
}: ConversationListProps) {
  const getInitials = (name: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="lg:col-span-1 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Button className="w-full">
        <UserPlus className="h-4 w-4 mr-2" />
        New Conversation
      </Button>
      
      <div className="space-y-2 h-[400px] md:h-[600px] overflow-y-auto">
        {loading ? (
          <>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 border rounded-md">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </>
        ) : filteredConversations.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">No conversations yet</p>
            </CardContent>
          </Card>
        ) : (
          filteredConversations.map((conv) => (
            <div
              key={conv.id}
              className={`flex items-start gap-3 p-3 border rounded-md cursor-pointer transition-colors ${
                activeConversation === conv.id ? "bg-primary/10 border-primary/20" : "hover:bg-muted"
              }`}
              onClick={() => handleOpenConversation(conv.id)}
            >
              <Avatar>
                <AvatarFallback>{getInitials(conv.person?.full_name || "?")}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center gap-2">
                  <h4 className="font-medium text-sm truncate">
                    {conv.person?.full_name || "Unknown"}
                  </h4>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {conv.lastMessage?.created_at && format(new Date(conv.lastMessage.created_at), "MMM d")}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{conv.lastMessage?.content}</p>
              </div>
              <div className="flex flex-col items-end gap-1 ml-1">
                {conv.unreadCount > 0 && (
                  <Badge variant="default" className="rounded-full h-5 min-w-[20px] flex items-center justify-center">
                    {conv.unreadCount}
                  </Badge>
                )}
                <ChevronRight className="h-4 w-4 text-muted-foreground mt-auto" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
