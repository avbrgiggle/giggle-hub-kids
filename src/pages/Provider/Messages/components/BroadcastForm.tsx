
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Student } from "@/types/database.types";
import { Send } from "lucide-react";

interface BroadcastFormProps {
  students: Student[];
  recipient: string;
  setRecipient: (value: string) => void;
  subject: string;
  setSubject: (value: string) => void;
  messageContent: string;
  setMessageContent: (value: string) => void;
  sendingMessage: boolean;
  handleSendGroupMessage: () => void;
}

export default function BroadcastForm({
  students,
  recipient,
  setRecipient,
  subject,
  setSubject,
  messageContent,
  setMessageContent,
  sendingMessage,
  handleSendGroupMessage
}: BroadcastFormProps) {
  return (
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
            disabled={sendingMessage || !recipient || !messageContent.trim()}
          >
            <Send className="h-4 w-4 mr-2" />
            Send Message
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
