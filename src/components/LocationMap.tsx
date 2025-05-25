
import { MapPin } from 'lucide-react';

interface LocationMapProps {
  address: string;
  className?: string;
}

const LocationMap = ({ address, className = "" }: LocationMapProps) => {
  return (
    <div className={`rounded-md border bg-muted/50 flex flex-col items-center justify-center p-6 ${className}`}>
      <MapPin className="h-12 w-12 text-muted-foreground mb-3" />
      <h3 className="font-semibold text-lg mb-2">Location</h3>
      <p className="text-center text-muted-foreground max-w-sm">
        {address}
      </p>
      <p className="text-sm text-muted-foreground mt-2 text-center">
        Interactive map integration coming soon
      </p>
    </div>
  );
};

export default LocationMap;
