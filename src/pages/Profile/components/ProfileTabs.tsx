
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChildrenTabContent } from "./ChildrenTabContent";
import { ActivityTabContent } from "./ActivityTabContent";
import { MessageTabContent } from "./MessageTabContent";

interface ProfileTabsProps {
  userId: string | undefined;
}

export function ProfileTabs({ userId }: ProfileTabsProps) {
  return (
    <Tabs defaultValue="children" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="children">Children</TabsTrigger>
        <TabsTrigger value="activities">Booked Activities</TabsTrigger>
        <TabsTrigger value="messages">Provider Messages</TabsTrigger>
      </TabsList>

      <TabsContent value="children">
        <ChildrenTabContent userId={userId} />
      </TabsContent>

      <TabsContent value="activities">
        <ActivityTabContent />
      </TabsContent>

      <TabsContent value="messages">
        <MessageTabContent />
      </TabsContent>
    </Tabs>
  );
}
