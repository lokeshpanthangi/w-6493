
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { MobileNavbar } from "./MobileNavbar";
import { MobileHeader } from "./MobileHeader";
import { useIsMobile } from "@/hooks/use-mobile";

export function AppLayout() {
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex flex-col flex-1">
          <MobileHeader />
          
          <main className="flex-1 pb-16 pt-0">
            <div className="container mx-auto p-4">
              <Outlet />
            </div>
          </main>
          
          <MobileNavbar />
        </div>
      </div>
    </SidebarProvider>
  );
}
