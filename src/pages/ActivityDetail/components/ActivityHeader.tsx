
import { Badge } from "@/components/ui/badge";
import { Clock, Users, MapPin, Building } from "lucide-react";
import type { Activity } from "@/types/database.types";

interface ActivityHeaderProps {
  activity: Activity;
}

export function ActivityHeader({ activity }: ActivityHeaderProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full overflow-hidden border border-muted">
          <img
            src={activity.provider?.avatar_url || "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b"}
            alt={activity.provider?.full_name || "Provider"}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <Badge variant="secondary" className="mb-2">
            Ages {activity.age_range}
          </Badge>
          <h1 className="text-2xl font-bold">{activity.title}</h1>
          <p className="text-muted-foreground">{activity.provider?.full_name}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span>{activity.duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span>{activity.capacity} capacity</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span>{activity.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-muted-foreground" />
          <span>{activity.category}</span>
        </div>
      </div>
    </div>
  );
}
