
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default function MessagesTab() {
  const [messages] = useState([]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Messages</h2>
        <Button>
          <MessageSquare className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </div>

      {messages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground mb-4">
              You don't have any messages yet.
            </p>
            <p className="text-sm text-center max-w-md">
              Messages from parents regarding bookings and inquiries will appear here.
              You can also initiate new conversations with parents.
            </p>
          </CardContent>
        </Card>
      ) : (
        <></>
      )}
    </div>
  );
}
