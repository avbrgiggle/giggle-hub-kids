
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Message } from "@/types/database.types";
import { format } from "date-fns";
import { Check, Clock, Mail, Send } from "lucide-react";

interface ConversationViewProps {
  activeConversation: string | null;
  conversations: any[];
  messages: Message[];
  messagesLoading: boolean;
  messageContent: string;
  setMessageContent: (value: string) => void;
  sendingMessage: boolean;
  handleSendDirectMessage: () => void;
  getInitials: (name: string) => string;
}

export default function ConversationView({
  activeConversation,
  conversations,
  messages,
  messagesLoading,
  messageContent,
  setMessageContent,
  sendingMessage,
  handleSendDirectMessage,
  getInitials
}: ConversationViewProps) {
  const activePerson = conversations.find(c => c.id === activeConversation)?.person;

  return (
    <Card className="h-full flex flex-col">
      {activeConversation ? (
        <>
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>
                  {getInitials(activePerson?.full_name || "?")}
                </AvatarFallback>
              </Avatar>
              <CardTitle>
                {activePerson?.full_name || "Unknown"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[400px]">
              {messagesLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Skeleton className="h-6 w-6 rounded-full animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-full text-center p-4">
                  <Mail className="h-12 w-12 text-muted-foreground/50 mb-2" />
                  <p className="text-muted-foreground">No messages yet</p>
                  <p className="text-xs text-muted-foreground/70">Start the conversation by sending a message below</p>
                </div>
              ) : (
                messages.map((message) => {
                  const isUserMessage = message.sender_id === activeConversation;
                  return (
                    <div 
                      key={message.id} 
                      className={`flex ${isUserMessage ? "justify-end" : "justify-start"}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg p-3 ${
                          isUserMessage 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-muted"
                        }`}
                      >
                        <p>{message.content}</p>
                        <div className="mt-1 flex justify-end items-center gap-1">
                          <span className="text-xs opacity-70">
                            {format(new Date(message.created_at), "HH:mm")}
                          </span>
                          {isUserMessage && (
                            <div className="opacity-70">
                              {message.read ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                <Clock className="h-3 w-3" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Textarea 
                  placeholder="Type your message here..." 
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  className="min-h-[80px]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendDirectMessage();
                    }
                  }}
                />
                <Button 
                  className="self-end" 
                  onClick={handleSendDirectMessage}
                  disabled={sendingMessage || !messageContent.trim()}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </CardContent>
        </>
      ) : (
        <CardContent className="flex flex-col justify-center items-center h-full text-center p-8">
          <Mail className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-xl font-medium mb-2">Select a Conversation</h3>
          <p className="text-muted-foreground max-w-md">
            Choose a conversation from the sidebar to view and respond to messages
          </p>
        </CardContent>
      )}
    </Card>
  );
}
