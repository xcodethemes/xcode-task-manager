
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, Menu, Plus, Search, User, LogOut, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isSidebarOpen,
  toggleSidebar,
}) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  // Function to get the current page title
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/') return 'Dashboard';
    if (path === '/tasks') return 'Tasks';
    if (path === '/projects') return 'Projects';
    if (path === '/employees') return 'Team Members';
    if (path.startsWith('/projects/')) return 'Project Details';
    if (path.startsWith('/tasks/')) return 'Task Details';
    
    return 'Task Manager';
  };

  return (
    <header className="h-16 border-b border-border backdrop-blur-md bg-background/80 sticky top-0 z-10 animate-slide-down">
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2 lg:hidden" 
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
        </div>

        <div className="hidden md:flex items-center space-x-1 bg-background/60 border border-border/40 rounded-full px-3 py-1.5 w-64 lg:w-[320px]">
          <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <input 
            type="text"
            placeholder="Search tasks, projects..."
            className="bg-transparent border-none outline-none px-2 py-1 text-sm w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Bell className="h-5 w-5" />
          </Button>
          
          <Button variant="outline" size="sm" className="hidden md:flex">
            <Plus className="h-4 w-4 mr-1" /> New Task
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://i.pravatar.cc/150?img=12" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass-panel">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="h-4 w-4 mr-2" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="h-4 w-4 mr-2" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
