
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMessages } from "./hooks/useMessages";
import ConversationList from "./components/ConversationList";
import ConversationView from "./components/ConversationView";
import BroadcastForm from "./components/BroadcastForm";

export default function MessagesCenter() {
  const { user } = useAuth();
  const {
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
  } = useMessages(user?.id);

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
            <ConversationList
              loading={loading}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filteredConversations={filteredConversations}
              activeConversation={activeConversation}
              handleOpenConversation={handleOpenConversation}
            />
            
            <div className="lg:col-span-2">
              <ConversationView
                activeConversation={activeConversation}
                conversations={conversations}
                messages={messages}
                messagesLoading={messagesLoading}
                messageContent={messageContent}
                setMessageContent={setMessageContent}
                sendingMessage={sendingMessage}
                handleSendDirectMessage={handleSendDirectMessage}
                getInitials={getInitials}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="broadcast">
          <BroadcastForm
            students={students}
            recipient={recipient}
            setRecipient={setRecipient}
            subject={subject}
            setSubject={setSubject}
            messageContent={messageContent}
            setMessageContent={setMessageContent}
            sendingMessage={sendingMessage}
            handleSendGroupMessage={handleSendGroupMessage}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
