
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function MessagesTab() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Messages</h2>
        <p className="text-muted-foreground">Communicate with parents and manage your conversations</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Messaging System</CardTitle>
          <CardDescription>
            This feature will be implemented in future updates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8 text-muted-foreground">
            The messaging system is coming soon. You'll be able to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Chat directly with parents</li>
            <li>Send group messages to activity participants</li>
            <li>Share documents and images</li>
            <li>Create message templates</li>
            <li>Schedule automated messages</li>
            <li>Receive notifications for new messages</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
