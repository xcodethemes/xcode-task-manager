
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

const TaskLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Automatically close sidebar on mobile when navigating
  useEffect(() => {
    const isMobile = window.innerWidth < 1024;
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300 ease-in-out", 
        sidebarOpen ? "lg:ml-64" : "lg:ml-20"
      )}>
        <Header isSidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default TaskLayout;

// Helper function (was imported from @/lib/utils)
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
