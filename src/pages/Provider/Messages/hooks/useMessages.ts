
import { useState, useEffect } from "react";
import { Message, Student } from "@/types/database.types";
import { getStudents } from "@/services/studentService";
import { fetchUserMessages, fetchConversationMessages, markMessagesAsRead, sendMessage } from "@/services/messageService";
import { toast } from "@/components/ui/use-toast";

type Conversation = {
  id: string;
  person: any;
  lastMessage: Message;
  unreadCount: number;
};

export const useMessages = (userId: string | undefined) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageContent, setMessageContent] = useState("");
  const [subject, setSubject] = useState("");
  const [recipient, setRecipient] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadData = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        
        // Fetch students
        const studentsData = await getStudents(userId);
        setStudents(studentsData);
        
        // Fetch messages
        const messagesData = await fetchUserMessages(userId);
        
        // Process conversations
        const conversationsMap = new Map<string, Conversation>();
        messagesData.forEach((message: Message) => {
          const isUserSender = message.sender_id === userId;
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
            const conversation = conversationsMap.get(otherPersonId)!;
            if (new Date(message.created_at) > new Date(conversation.lastMessage.created_at)) {
              conversation.lastMessage = message;
            }
            if (!isUserSender && !message.read) {
              conversation.unreadCount += 1;
            }
          }
        });

        setConversations(Array.from(conversationsMap.values()));
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          variant: "destructive",
          title: "Error loading data",
          description: "There was a problem loading your messages and students."
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  const handleOpenConversation = async (otherPersonId: string) => {
    if (!userId) return;
    
    try {
      setMessagesLoading(true);
      setActiveConversation(otherPersonId);
      
      const messagesData = await fetchConversationMessages(userId, otherPersonId);
      setMessages(messagesData);
      
      // Mark unread messages as read
      const unreadMessages = messagesData
        .filter((msg: Message) => msg.receiver_id === userId && !msg.read)
        .map((msg: Message) => msg.id);
      
      if (unreadMessages.length > 0) {
        await markMessagesAsRead(unreadMessages);
          
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
      console.error("Error opening conversation:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load conversation messages."
      });
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleSendDirectMessage = async () => {
    if (!userId || !activeConversation || !messageContent.trim()) {
      toast({
        title: "Missing information",
        description: "Please select a conversation and enter a message.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSendingMessage(true);
      
      const newMessage = await sendMessage(userId, activeConversation, messageContent);
      
      setMessages(prev => [...prev, newMessage]);
      
      setConversations(prev => 
        prev.map(conv => {
          if (conv.id === activeConversation) {
            return { 
              ...conv, 
              lastMessage: newMessage,
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

  const handleSendGroupMessage = async () => {
    if (!userId || !recipient || !messageContent.trim()) {
      toast({
        title: "Missing information",
        description: "Please select a recipient and enter a message.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSendingMessage(true);
      let sentCount = 0;
      
      if (recipient === "all") {
        // Send to all parents of students
        const uniqueParents = new Set();
        for (const student of students) {
          // In a real app, we would have parent IDs in the student records
          // For now, we're just simulating by using email as a key
          if (!uniqueParents.has(student.parent_email)) {
            uniqueParents.add(student.parent_email);
            // In a real app, we would use the parent ID here
            const parentId = `parent-${student.id}`;
            await sendMessage(
              userId, 
              parentId, 
              subject ? `${subject}: ${messageContent}` : messageContent
            );
            sentCount++;
          }
        }
      } else {
        // Send to parents of a specific student
        const student = students.find(s => s.id === recipient);
        if (student) {
          // In a real app, we would use the parent ID here
          const parentId = `parent-${student.id}`;
          await sendMessage(
            userId, 
            parentId, 
            subject ? `${subject}: ${messageContent}` : messageContent
          );
          sentCount = 1;
        }
      }
      
      toast({
        title: "Messages sent",
        description: `Successfully sent ${sentCount} message${sentCount !== 1 ? 's' : ''}.`,
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

  const filteredConversations = conversations.filter(conv => {
    const personName = conv.person?.full_name?.toLowerCase() || "";
    return personName.includes(searchQuery.toLowerCase());
  });

  return {
    students,
    loading,
    messageContent,
    setMessageContent,
    subject,
    setSubject,
    recipient,
    setRecipient,
    conversations,
    activeConversation,
    messages,
    messagesLoading,
    sendingMessage,
    searchQuery,
    setSearchQuery,
    filteredConversations,
    handleOpenConversation,
    handleSendDirectMessage,
    handleSendGroupMessage
  };
};
