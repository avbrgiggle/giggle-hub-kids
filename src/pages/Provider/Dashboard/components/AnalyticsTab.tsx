
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsTab() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Analytics & Reporting</h2>
        <p className="text-muted-foreground">Track performance and gain insights into your activities</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
          <CardDescription>
            This feature will be implemented in future updates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8 text-muted-foreground">
            The analytics dashboard is coming soon. You'll be able to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>View booking trends over time</li>
            <li>See revenue breakdowns by activity</li>
            <li>Track attendance statistics</li>
            <li>Analyze participant demographics</li>
            <li>Export financial reports</li>
            <li>Get insights on most popular activities</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
