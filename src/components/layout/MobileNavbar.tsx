
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Plus, History, User } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export function MobileNavbar() {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  if (!isMobile) return null;
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background z-40 pb-safe-area-inset-bottom">
      <nav className="flex justify-around items-center h-16">
        <Link
          to="/dashboard"
          className={cn(
            "navbar-item",
            isActive("/dashboard") && "active"
          )}
        >
          <Home size={20} />
          <span className="text-xs">Home</span>
        </Link>
        
        <Link
          to="/create-room"
          className={cn(
            "navbar-item",
            isActive("/create-room") && "active"
          )}
        >
          <Plus size={20} />
          <span className="text-xs">Create</span>
        </Link>
        
        <Link
          to="/history"
          className={cn(
            "navbar-item",
            isActive("/history") && "active"
          )}
        >
          <History size={20} />
          <span className="text-xs">History</span>
        </Link>
        
        <Link
          to="/profile"
          className={cn(
            "navbar-item",
            isActive("/profile") && "active"
          )}
        >
          <User size={20} />
          <span className="text-xs">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
