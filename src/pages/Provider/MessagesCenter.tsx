import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, UserPlus, Send, ChevronRight, Mail, Check, Clock } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { getStudents } from "@/services/providerService";
import { Student } from "@/types/database.types";
import { supabase } from "@/integrations/supabase/client";
import { Message, Profile } from "@/types/database.types";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";

export default function MessagesCenter() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageContent, setMessageContent] = useState("");
  const [subject, setSubject] = useState("");
  const [recipient, setRecipient] = useState("");
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!user) return;
      try {
        const data = await getStudents(user.id);
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    const fetchMessages = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("messages")
          .select(`
            id,
            content,
            created_at,
            read,
            updated_at,
            sender_id,
            receiver_id,
            sender:sender_id(id, full_name, avatar_url),
            receiver:receiver_id(id, full_name, avatar_url)
          `)
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order("created_at", { ascending: false });

        if (error) throw error;

        const conversationsMap = new Map();
        (data as Message[]).forEach((message: Message) => {
          const isUserSender = message.sender_id === user.id;
          const otherPersonId = isUserSender ? message.receiver_id : message.sender_id;
          const otherPerson = isUserSender ? message.receiver : message.sender;
          
          if (!conversationsMap.has(otherPersonId)) {
            conversationsMap.set(otherPersonId, {
              id: otherPersonId,
              person: otherPerson,
              lastMessage: message,
              unreadCount: isUserSender ? 0 : (message.read ? 0 : 1)
            });
          } else {
            const conversation = conversationsMap.get(otherPersonId);
            if (!isUserSender && !message.read) {
              conversation.unreadCount += 1;
            }
          }
        });

        setConversations(Array.from(conversationsMap.values()));
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
    fetchMessages();
  }, [user]);

  const fetchConversationMessages = async (otherPersonId: string) => {
    if (!user) return;
    try {
      setMessagesLoading(true);
      const { data, error } = await supabase
        .from("messages")
        .select(`
          id,
          content,
          created_at,
          updated_at,
          read,
          sender_id,
          receiver_id,
          sender:sender_id(id, full_name, avatar_url),
          receiver:receiver_id(id, full_name, avatar_url)
        `)
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherPersonId}),and(sender_id.eq.${otherPersonId},receiver_id.eq.${user.id})`)
        .order("created_at", { ascending: true });

      if (error) throw error;
      
      setMessages(data as Message[]);
      
      const unreadMessages = (data as Message[])
        .filter((msg: Message) => msg.receiver_id === user.id && !msg.read)
        .map((msg: Message) => msg.id);
      
      if (unreadMessages.length > 0) {
        await supabase
          .from("messages")
          .update({ read: true })
          .in("id", unreadMessages);
          
        setConversations(prev => 
          prev.map(conv => {
            if (conv.id === otherPersonId) {
              return { ...conv, unreadCount: 0 };
            }
            return conv;
          })
        );
      }
    } catch (error) {
      console.error("Error fetching conversation messages:", error);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleSendGroupMessage = async () => {
    if (!user || !recipient || !messageContent) {
      toast({
        title: "Missing information",
        description: "Please select a recipient and enter a message.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSendingMessage(true);
      
      const dummyParentId = "dummy-parent-id";
      
      if (recipient === "all") {
        for (const student of students) {
          const parentId = dummyParentId;
          await supabase
            .from("messages")
            .insert({
              sender_id: user.id,
              receiver_id: parentId,
              content: messageContent,
              read: false
            });
        }
      } else {
        const activityStudents = students.filter(s => s.id === recipient);
        for (const student of activityStudents) {
          const parentId = dummyParentId;
          await supabase
            .from("messages")
            .insert({
              sender_id: user.id,
              receiver_id: parentId,
              content: subject ? `${subject}: ${messageContent}` : messageContent,
              read: false
            });
        }
      }
      
      toast({
        title: "Messages sent",
        description: "Your messages have been sent successfully.",
      });
      
      setMessageContent("");
      setSubject("");
    } catch (error) {
      console.error("Error sending messages:", error);
      toast({
        title: "Error",
        description: "Failed to send messages. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSendingMessage(false);
    }
  };

  const handleSendDirectMessage = async () => {
    if (!user || !activeConversation || !messageContent) {
      toast({
        title: "Missing information",
        description: "Please select a conversation and enter a message.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSendingMessage(true);
      
      const { data, error } = await supabase
        .from("messages")
        .insert({
          sender_id: user.id,
          receiver_id: activeConversation,
          content: messageContent,
          read: false
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setMessages(prev => [...prev, data]);
      
      setConversations(prev => 
        prev.map(conv => {
          if (conv.id === activeConversation) {
            return { 
              ...conv, 
              lastMessage: data,
              unreadCount: 0
            };
          }
          return conv;
        })
      );
      
      setMessageContent("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSendingMessage(false);
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const personName = conv.person?.full_name?.toLowerCase() || "";
    return personName.includes(searchQuery.toLowerCase());
  });

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
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Messages</h1>

      <Tabs defaultValue="conversations" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="broadcast">Send Broadcast</TabsTrigger>
        </TabsList>
        
        <TabsContent value="conversations">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                      onClick={() => {
                        setActiveConversation(conv.id);
                        fetchConversationMessages(conv.id);
                      }}
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
            
            <div className="lg:col-span-2">
              <Card className="h-full flex flex-col">
                {activeConversation ? (
                  <>
                    <CardHeader className="border-b">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {getInitials(
                              conversations.find(c => c.id === activeConversation)?.person?.full_name || "?"
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <CardTitle>
                          {conversations.find(c => c.id === activeConversation)?.person?.full_name || "Unknown"}
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
                            const isUserMessage = message.sender_id === user?.id;
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
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="broadcast">
          <Card>
            <CardHeader>
              <CardTitle>Send Broadcast Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipients</Label>
                <Select value={recipient} onValueChange={setRecipient}>
                  <SelectTrigger id="recipient">
                    <SelectValue placeholder="Select recipients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Parents</SelectItem>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.first_name} {student.last_name}'s Parent
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject (Optional)</Label>
                <Input 
                  id="subject" 
                  placeholder="Message subject..." 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Type your message here..." 
                  className="min-h-[200px]"
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleSendGroupMessage}
                  disabled={sendingMessage || !recipient || !messageContent}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
