
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  BarChart2,
  CheckSquare,
  ChevronLeft,
  Folders,
  Home,
  LayoutDashboard,
  Settings,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const isMobile = useIsMobile();

  // Navigation items
  const navItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/',
    },
    {
      title: 'Tasks',
      icon: CheckSquare,
      path: '/tasks',
    },
    {
      title: 'Projects',
      icon: Folders,
      path: '/projects',
    },
    {
      title: 'Team',
      icon: Users,
      path: '/team',  // Changed from '/employees' to '/team' to match routes in App.tsx
    },
    {
      title: 'Reports',
      icon: BarChart2,
      path: '/reports',
    },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };
  
  // Hide sidebar completely on mobile when closed
  if (isMobile && !isOpen) {
    return null;
  }

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 w-64 transform transition-all duration-300 ease-in-out bg-sidebar border-r border-border flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"
      )}
    >
      <div className="h-16 border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <Home className="h-6 w-6 text-primary" />
          {isOpen && <span className="font-semibold text-lg">TaskFlow</span>}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="lg:flex hidden"
        >
          <ChevronLeft 
            className={cn(
              "h-5 w-5 transition-transform", 
              !isOpen && "rotate-180"
            )} 
          />
        </Button>
      </div>

      <div className="flex-1 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center py-2 px-4 mx-2 rounded-md transition-colors group",
              isActive(item.path)
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/60"
            )}
            onClick={() => isMobile && toggleSidebar()}
          >
            <item.icon className={cn("h-5 w-5 flex-shrink-0", isOpen ? "mr-3" : "mx-auto")} />
            {isOpen && <span>{item.title}</span>}
          </Link>
        ))}
      </div>

      <div className="p-4 border-t border-border">
        <Link
          to="/settings"
          className={cn(
            "flex items-center py-2 px-4 rounded-md transition-colors",
            isActive("/settings")
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent/60"
          )}
          onClick={() => isMobile && toggleSidebar()}
        >
          <Settings className={cn("h-5 w-5", isOpen ? "mr-3" : "mx-auto")} />
          {isOpen && <span>Settings</span>}
        </Link>
      </div>
    </aside>
  );
};
