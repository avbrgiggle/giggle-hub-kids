
import { Outlet } from "react-router-dom";
import ProviderSidebar from "./components/ProviderSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function ProviderLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-center text-muted-foreground">
          You need to be logged in to access the provider dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-muted/10">
      <ProviderSidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
