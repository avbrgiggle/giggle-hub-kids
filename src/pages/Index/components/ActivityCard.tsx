
import React from "react";
import { Link } from "react-router-dom";
import { Heart, MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import type { Activity } from "@/types/database.types";

interface ActivityCardProps {
  activity: Activity;
  onSave: (activityId: string) => void;
}

export const ActivityCard = ({ activity, onSave }: ActivityCardProps) => {
  const { t } = useTranslation();

  const formatDuration = (duration: string) => {
    const [hours, minutes] = duration.split(':');
    if (!hours || !minutes) return duration;
    return `${hours}${t("activity.duration").split(" ")[0]} ${minutes}${t("activity.duration").split(" ")[1]}`;
  };
  
  return (
    <Link 
      to={`/activities/${activity.id}`}
      className="activity-card animate-slide-up group"
    >
      <div className="activity-image">
        <img
          src={activity.image_url || "https://images.unsplash.com/photo-1472396961693-142e6e269027"}
          alt={activity.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            onSave(activity.id);
          }}
          className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
        >
          <Heart className="w-5 h-5 text-primary" />
        </button>
      </div>
      <div className="activity-content">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div>
              <Badge variant="secondary" className="mb-1">
                {t("activity.ages")} {activity.age_range}
              </Badge>
              <h3 className="text-lg font-semibold">{activity.title}</h3>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-primary">
              {activity.price === 0 ? t("activity.free") : `$${activity.price}`}
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {activity.description}
        </p>
        <div className="flex items-center gap-4 pt-2">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {activity.location}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm">
              {formatDuration(String(activity.duration))}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
