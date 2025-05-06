
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Plus, History, User, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Dice3D } from "@/components/ui/dice-3d";
import { useIsMobile } from "@/hooks/use-mobile";

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
        <SidebarTrigger className="ml-auto" />
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
          <Link to="/history">
            <Button
              variant={isActive("/history") ? "default" : "ghost"}
              className="w-full justify-start"
              size="sm"
            >
              <History className="mr-2 h-4 w-4" />
              Past Decisions
            </Button>
          </Link>
          
          <Separator className="my-4" />
          
          <Link to="/notifications">
            <Button
              variant={isActive("/notifications") ? "default" : "ghost"}
              className="w-full justify-start"
              size="sm"
            >
              <Bell className="mr-2 h-4 w-4" />
              Notifications
              <span className="ml-auto bg-dicey-purple text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                2
              </span>
            </Button>
          </Link>
          <Link to="/settings">
            <Button
              variant={isActive("/settings") ? "default" : "ghost"}
              className="w-full justify-start"
              size="sm"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </Link>
        </div>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <Link to="/profile">
          <div className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-muted">
            <UserAvatar src="" name="John Doe" status="online" size="sm" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">John Doe</span>
              <span className="text-xs text-muted-foreground">john@example.com</span>
            </div>
          </div>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
