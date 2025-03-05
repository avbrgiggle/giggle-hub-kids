
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export function MessageTabContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Provider Messages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="mt-2 text-muted-foreground">
            No messages yet. Book an activity to start chatting with providers.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
