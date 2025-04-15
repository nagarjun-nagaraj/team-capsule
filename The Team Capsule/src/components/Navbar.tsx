import { Link, useLocation } from "react-router-dom";
import { Home, CalendarClock, User, FileText, Users, FileDown } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { isManager, currentUser, logout } = useAuth();
  
  const getNavItems = () => {
    const items = [
      { name: "Dashboard", path: "/", icon: Home },
      { name: "Leave Requests", path: "/leave-requests", icon: FileText },
      { name: "Calendar", path: "/calendar", icon: CalendarClock },
      { name: "Resources", path: "/resources", icon: FileDown },
      { name: "Profile", path: "/profile", icon: User },
    ];
    
    if (isManager) {
      items.splice(2, 0, { name: "Manage Requests", path: "/manage-requests", icon: Users });
    }
    
    return items;
  };
  
  const navItems = getNavItems();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">The Team Capsule</span>
        </div>
        <NavigationMenu>
          <NavigationMenuList
            className={cn(
              "flex gap-1",
              isMobile && "flex-col absolute top-16 right-0 p-4 border-l bg-background shadow-md h-[calc(100vh-64px)]"
            )}
          >
            {navItems.map((item) => (
              <NavigationMenuItem key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "group inline-flex w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                    location.pathname === item.path && "bg-accent/50",
                    isMobile && "flex w-full"
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              </NavigationMenuItem>
            ))}
            
            {currentUser && (
              <NavigationMenuItem>
                <button
                  onClick={handleLogout}
                  className="group inline-flex w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600 focus:outline-none"
                >
                  Logout
                </button>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};

export default Navbar;
