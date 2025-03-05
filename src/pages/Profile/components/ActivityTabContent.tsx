
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ActivityTabContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Booked Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">No activities booked yet.</p>
      </CardContent>
    </Card>
  );
}
