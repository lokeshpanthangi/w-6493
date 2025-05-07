import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Plus, History, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Dice3D } from "@/components/ui/dice-3d";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/context/AuthContext";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Don't show the sidebar on mobile
  if (isMobile) return null;

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4 flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Dice3D size="sm" className="shrink-0" />
          <h1 className="font-bold text-xl truncate">DiceyDecisions</h1>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-2">
        <div className="space-y-1 py-2">
          <Link to="/dashboard">
            <Button
              variant={isActive("/dashboard") ? "default" : "ghost"}
              className="w-full justify-start"
              size="sm"
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </Link>
          <Link to="/create-room">
            <Button
              variant={isActive("/create-room") ? "default" : "ghost"}
              className="w-full justify-start"
              size="sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Room
            </Button>
          </Link>
          <Button
            variant={isActive("/dashboard?tab=expired") ? "default" : "ghost"}
            className="w-full justify-start"
            size="sm"
            onClick={() => navigate("/dashboard?tab=expired")}
          >
            <History className="mr-2 h-4 w-4" />
            Past Decisions
          </Button>
        </div>
      </SidebarContent>
      
      <SidebarFooter className="p-4 flex flex-col gap-2">
        <Link to="/profile">
          <div className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-muted">
            <UserAvatar 
              src={user?.user_metadata?.avatar_url || ""} 
              name={user?.user_metadata?.full_name || "User"} 
              status="online" 
              size="sm" 
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user?.user_metadata?.full_name || "User"}</span>
              <span className="text-xs text-muted-foreground">{user?.email || ""}</span>
            </div>
          </div>
        </Link>
        <Button variant="outline" className="w-full mt-2" onClick={signOut}>
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
