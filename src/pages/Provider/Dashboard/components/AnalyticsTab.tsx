
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Calendar, User, DollarSign } from "lucide-react";

export default function AnalyticsTab() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Analytics</h2>
        <p className="text-muted-foreground">Data insights for your activities and students</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <MetricCard
          title="Total Students"
          value="0"
          description="Enrolled in your activities"
          icon={<User className="h-5 w-5" />}
        />
        <MetricCard
          title="Total Bookings"
          value="0"
          description="Across all activities"
          icon={<Calendar className="h-5 w-5" />}
        />
        <MetricCard
          title="Activities"
          value="0"
          description="Active activities"
          icon={<BarChart className="h-5 w-5" />}
        />
        <MetricCard
          title="Revenue"
          value="€0"
          description="Total earnings"
          icon={<DollarSign className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Popular Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              No activity data available yet. As you add activities and enroll students,
              you'll see which activities are the most popular.
            </p>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              No revenue data available yet. As payments are processed, 
              your monthly revenue will be displayed here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}

function MetricCard({ title, value, description, icon }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-muted-foreground text-sm">{title}</span>
          <span className="bg-primary/10 text-primary p-2 rounded-full">{icon}</span>
        </div>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}
