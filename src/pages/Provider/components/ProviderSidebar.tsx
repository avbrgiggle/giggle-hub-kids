
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Users, 
  CalendarDays, 
  MessageSquare, 
  DollarSign, 
  Settings, 
  LogOut,
  FileText,
  BarChart2,
  PlusCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const NavItem = ({ to, icon, label, active }: NavItemProps) => (
  <Link to={to}>
    <Button
      variant={active ? "default" : "ghost"}
      className="w-full justify-start mb-1"
    >
      {icon}
      <span className="ml-2">{label}</span>
    </Button>
  </Link>
);

export default function ProviderSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentPath = location.pathname;

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to log out",
      });
    }
  };

  return (
    <div className="w-64 h-screen p-4 border-r">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-1">Provider Portal</h2>
        <p className="text-sm text-muted-foreground">Manage your activities</p>
      </div>

      <div className="space-y-1 flex flex-col h-[calc(100vh-180px)]">
        <div className="flex-none">
          <NavItem
            to="/provider/dashboard"
            icon={<Home className="h-5 w-5" />}
            label="Dashboard"
            active={currentPath === "/provider" || currentPath === "/provider/dashboard"}
          />
          
          <div className="pt-2 pb-2">
            <p className="text-xs font-medium text-muted-foreground pl-3 pb-2">ACTIVITIES</p>
            <NavItem
              to="/provider/activities/new"
              icon={<PlusCircle className="h-5 w-5" />}
              label="New Activity"
              active={currentPath === "/provider/activities/new"}
            />
            <NavItem
              to="/provider/extracurricular/new"
              icon={<PlusCircle className="h-5 w-5" />}
              label="New Extracurricular"
              active={currentPath === "/provider/extracurricular/new"}
            />
          </div>
          
          <div className="pt-2 pb-2">
            <p className="text-xs font-medium text-muted-foreground pl-3 pb-2">MANAGEMENT</p>
            <NavItem
              to="/provider/students"
              icon={<Users className="h-5 w-5" />}
              label="Students"
              active={currentPath.startsWith("/provider/students")}
            />
            <NavItem
              to="/provider/attendance"
              icon={<CalendarDays className="h-5 w-5" />}
              label="Attendance"
              active={currentPath.startsWith("/provider/attendance")}
            />
            <NavItem
              to="/provider/messages"
              icon={<MessageSquare className="h-5 w-5" />}
              label="Messages"
              active={currentPath.startsWith("/provider/messages")}
            />
          </div>
          
          <div className="pt-2 pb-2">
            <p className="text-xs font-medium text-muted-foreground pl-3 pb-2">FINANCIALS</p>
            <NavItem
              to="/provider/billing"
              icon={<FileText className="h-5 w-5" />}
              label="Invoices & Billing"
              active={currentPath.startsWith("/provider/billing")}
            />
            <NavItem
              to="/provider/payments"
              icon={<DollarSign className="h-5 w-5" />}
              label="Payments"
              active={currentPath.startsWith("/provider/payments")}
            />
          </div>
          
          <div className="pt-2 pb-2">
            <p className="text-xs font-medium text-muted-foreground pl-3 pb-2">INSIGHTS</p>
            <NavItem
              to="/provider/analytics"
              icon={<BarChart2 className="h-5 w-5" />}
              label="Analytics"
              active={currentPath.startsWith("/provider/analytics")}
            />
          </div>
        </div>

        <div className="mt-auto pt-4">
          <NavItem
            to="/provider/settings"
            icon={<Settings className="h-5 w-5" />}
            label="Settings"
            active={currentPath.startsWith("/provider/settings")}
          />
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-2">Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
