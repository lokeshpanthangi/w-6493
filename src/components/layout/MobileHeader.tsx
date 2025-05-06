
import { Bell, Menu } from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Dice3D } from "@/components/ui/dice-3d";

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
}

export function MobileHeader({ title, showBack = false }: MobileHeaderProps) {
  const isMobile = useIsMobile();
  
  if (!isMobile) return null;
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-14 items-center px-4">
        <div className="flex items-center gap-2">
          <Dice3D size="sm" />
          {title ? (
            <h1 className="font-bold truncate">{title}</h1>
          ) : (
            <h1 className="font-bold truncate">DiceyDecisions</h1>
          )}
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          <Link to="/notifications">
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-dicey-purple text-[10px] text-white">
                2
              </span>
            </Button>
          </Link>
          
          <Link to="/profile">
            <UserAvatar src="" name="John Doe" size="sm" />
          </Link>
        </div>
      </div>
    </header>
  );
}
