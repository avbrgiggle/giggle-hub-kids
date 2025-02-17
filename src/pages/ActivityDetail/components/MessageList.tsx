
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { format, parseISO } from "date-fns";
import type { Message } from "@/types/database.types";
import { useNavigate } from "react-router-dom";

interface MessageListProps {
  messages: Message[];
  currentUserId?: string;
  isAuthenticated: boolean;
  onNewMessage: () => void;
}

export function MessageList({ messages, currentUserId, isAuthenticated, onNewMessage }: MessageListProps) {
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground mb-4">
          Please log in to send messages to the provider.
        </p>
        <Button onClick={() => navigate("/login")}>Log In</Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 mb-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-4 ${
              msg.sender_id === currentUserId ? "flex-row-reverse" : ""
            }`}
          >
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={msg.sender?.avatar_url || "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b"}
                alt={msg.sender?.full_name || "User"}
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className={`rounded-lg p-3 max-w-[80%] ${
                msg.sender_id === currentUserId
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <p className="text-sm font-medium mb-1">
                {msg.sender?.full_name}
              </p>
              <p className="text-sm">{msg.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {format(parseISO(msg.created_at), "Pp")}
              </p>
            </div>
          </div>
        ))}
      </div>
      <Button onClick={onNewMessage} className="w-full">
        <MessageCircle className="w-4 h-4 mr-2" />
        Send Message
      </Button>
    </>
  );
}
