import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Bell, 
  Menu, 
  Plus, 
  Search, 
  X,
  Loader2,
  ProjectorIcon,
  CheckSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTaskContext } from '@/contexts/TaskContext';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { PriorityBadge } from '@/components/ui-custom/PriorityBadge';
import { UserMenu } from '@/components/ui-custom/UserMenu';

interface HeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isSidebarOpen,
  toggleSidebar,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchTasksAndProjects } = useTaskContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ tasks: any[], projects: any[] } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/') return 'Dashboard';
    if (path === '/tasks') return 'Tasks';
    if (path === '/projects') return 'Projects';
    if (path === '/team') return 'Team Members';
    if (path.startsWith('/projects/')) return 'Project Details';
    if (path.startsWith('/tasks/')) return 'Task Details';
    if (path.startsWith('/team/')) return 'Team Member Details';
    
    return 'Task Manager';
  };

  const handleSearch = () => {
    if (searchQuery.trim().length === 0) {
      setSearchResults(null);
      return;
    }
    
    setIsSearching(true);
    
    setTimeout(() => {
      const results = searchTasksAndProjects(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
      setShowResults(true);
    }, 300);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim().length === 0) {
      setSearchResults(null);
      setShowResults(false);
    } else {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
    setShowResults(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAddNewClick = () => {
    const path = location.pathname;
    
    if (path === '/tasks' || path.startsWith('/tasks/')) {
      navigate('/tasks/new');
    } else if (path === '/projects' || path.startsWith('/projects/')) {
      navigate('/projects/new');
    } else if (path === '/team' || path.startsWith('/team/')) {
      navigate('/team/new');
    } else {
      navigate('/tasks/new');
    }
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

        <div ref={searchRef} className="relative hidden md:block">
          <div className="flex items-center space-x-1 bg-background/60 border border-border/40 rounded-full px-3 py-1.5 w-64 lg:w-[320px]">
            <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <input 
              type="text"
              placeholder="Search tasks, projects..."
              className="bg-transparent border-none outline-none px-2 py-1 text-sm w-full"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5 rounded-full" 
                onClick={clearSearch}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          {showResults && (
            <Card className="absolute top-full mt-2 w-full max-h-[400px] overflow-auto shadow-lg z-50 animate-fade-in">
              <div className="p-2">
                {isSearching ? (
                  <div className="flex justify-center items-center p-4">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span className="ml-2 text-sm">Searching...</span>
                  </div>
                ) : (
                  <>
                    {searchResults && (
                      <>
                        {searchResults.tasks.length === 0 && searchResults.projects.length === 0 ? (
                          <div className="p-4 text-center text-muted-foreground">
                            <p>No results found for "{searchQuery}"</p>
                          </div>
                        ) : (
                          <>
                            {searchResults.tasks.length > 0 && (
                              <div className="mb-3">
                                <h3 className="text-xs uppercase text-muted-foreground font-semibold px-2 mb-1">Tasks</h3>
                                {searchResults.tasks.slice(0, 5).map(task => (
                                  <div 
                                    key={task.id}
                                    className="p-2 hover:bg-accent rounded-md cursor-pointer"
                                    onClick={() => {
                                      navigate(`/tasks/${task.id}`);
                                      clearSearch();
                                    }}
                                  >
                                    <div className="flex items-start justify-between">
                                      <div className="flex items-start space-x-2">
                                        <CheckSquare className="h-4 w-4 mt-0.5 text-primary" />
                                        <div>
                                          <p className="text-sm font-medium line-clamp-1">{task.title}</p>
                                          <p className="text-xs text-muted-foreground line-clamp-1">{task.description}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <StatusBadge status={task.status} className="text-xs py-0 h-5" />
                                        <PriorityBadge priority={task.priority} className="text-xs py-0 h-5" />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                {searchResults.tasks.length > 5 && (
                                  <div className="text-xs text-center text-primary p-1">
                                    + {searchResults.tasks.length - 5} more tasks
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {searchResults.projects.length > 0 && (
                              <div>
                                <h3 className="text-xs uppercase text-muted-foreground font-semibold px-2 mb-1">Projects</h3>
                                {searchResults.projects.slice(0, 5).map(project => (
                                  <div 
                                    key={project.id}
                                    className="p-2 hover:bg-accent rounded-md cursor-pointer"
                                    onClick={() => {
                                      navigate(`/projects/${project.id}`);
                                      clearSearch();
                                    }}
                                  >
                                    <div className="flex items-start justify-between">
                                      <div className="flex items-start space-x-2">
                                        <ProjectorIcon className="h-4 w-4 mt-0.5 text-primary" />
                                        <div>
                                          <p className="text-sm font-medium line-clamp-1">{project.name}</p>
                                          <p className="text-xs text-muted-foreground line-clamp-1">{project.description}</p>
                                        </div>
                                      </div>
                                      <StatusBadge status={project.status} className="text-xs py-0 h-5" />
                                    </div>
                                  </div>
                                ))}
                                {searchResults.projects.length > 5 && (
                                  <div className="text-xs text-center text-primary p-1">
                                    + {searchResults.projects.length - 5} more projects
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </Card>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Bell className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden md:flex"
            onClick={handleAddNewClick}
          >
            <Plus className="h-4 w-4 mr-1" /> New Item
          </Button>
          
          <UserMenu />
        </div>
      </div>
    </header>
  );
};
