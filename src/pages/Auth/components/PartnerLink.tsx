
import { Link } from "react-router-dom";
import { HandshakeIcon } from "lucide-react";

export const PartnerLink = () => {
  return (
    <div className="text-center mt-6 pt-6 border-t">
      <div className="flex items-center justify-center gap-2 text-primary hover:text-primary/80 transition-colors">
        <HandshakeIcon className="h-5 w-5" />
        <Link to="/partner-with-us" className="text-sm font-medium hover:underline">
          Want to partner with us?
        </Link>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Join our platform as an activity provider
      </p>
    </div>
  );
};
