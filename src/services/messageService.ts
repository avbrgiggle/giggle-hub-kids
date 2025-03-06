
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/database.types";

export const fetchUserMessages = async (userId: string) => {
  try {
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
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Message[];
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

export const fetchConversationMessages = async (userId: string, otherPersonId: string) => {
  try {
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
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherPersonId}),and(sender_id.eq.${otherPersonId},receiver_id.eq.${userId})`)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data as Message[];
  } catch (error) {
    console.error("Error fetching conversation messages:", error);
    throw error;
  }
};

export const markMessagesAsRead = async (messageIds: string[]) => {
  if (messageIds.length === 0) return;
  
  try {
    const { error } = await supabase
      .from("messages")
      .update({ read: true })
      .in("id", messageIds);
      
    if (error) throw error;
  } catch (error) {
    console.error("Error marking messages as read:", error);
    throw error;
  }
};

export const sendMessage = async (senderId: string, receiverId: string, content: string) => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        content: content,
        read: false
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as Message;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
