
import React, { useState } from 'react';
import { useTaskContext, Status } from '@/contexts/TaskContext';
import { ProjectCard } from '@/components/ui-custom/ProjectCard';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { Pagination } from '@/components/ui-custom/Pagination';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Check,
  ChevronDown,
  Filter,
  Folders,
  Loader2,
  Plus,
  Search,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Projects = () => {
  const { projects, tasks, employees, isLoading } = useTaskContext();
  const navigate = useNavigate();
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 9;

  // Apply filters
  let filteredProjects = [...projects];
  
  // Search filter
  if (searchQuery) {
    filteredProjects = filteredProjects.filter(project => 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  // Status filter
  if (statusFilter !== 'all') {
    filteredProjects = filteredProjects.filter(project => project.status === statusFilter);
  }
  
  // Sort by start date (newest first)
  filteredProjects.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  
  // Pagination logic
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const resetFilters = () => {
    setStatusFilter('all');
    setCurrentPage(1);
  };
  
  const isFiltering = statusFilter !== 'all';

  if (isLoading) {
    return (
      <div className="w-full h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage and track all your projects in one place
          </p>
        </div>
        <Button onClick={() => navigate('/projects/new')}>
          <Plus className="h-4 w-4 mr-2" /> New Project
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap sm:flex-nowrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10">
                <Filter className="h-4 w-4 mr-2" />
                Status
                <ChevronDown className="h-4 w-4 ml-1 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {['all', 'todo', 'in-progress', 'review', 'done'].map((status) => (
                <DropdownMenuItem 
                  key={status}
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setStatusFilter(status as Status | 'all')}
                >
                  {status === 'all' ? 'All Statuses' : (
                    <StatusBadge status={status as Status} />
                  )}
                  {statusFilter === status && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {isFiltering && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters}
              className="h-10"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Projects grid */}
      <div>
        {filteredProjects.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProjects.map((project) => {
                const projectTasks = tasks.filter(t => t.projectId === project.id);
                
                return (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    tasks={projectTasks}
                    employees={employees}
                    onClick={() => navigate(`/projects/${project.id}`)}
                  />
                );
              })}
            </div>
            
            {totalPages > 1 && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <Card className="py-16 flex flex-col items-center justify-center text-center">
            {searchQuery || isFiltering ? (
              <>
                <Search className="h-12 w-12 text-muted-foreground opacity-40" />
                <h3 className="mt-4 text-lg font-medium">No matching projects found</h3>
                <p className="text-muted-foreground mt-2 max-w-md">
                  Try adjusting your search or filters to find what you're looking for
                </p>
                <Button onClick={resetFilters} className="mt-4">
                  Clear Filters
                </Button>
              </>
            ) : (
              <>
                <div className={cn(
                  "h-20 w-20 rounded-full flex items-center justify-center",
                  "bg-primary/10 text-primary mb-2"
                )}>
                  <Folders className="h-10 w-10" />
                </div>
                <h3 className="mt-2 text-lg font-medium">No projects yet</h3>
                <p className="text-muted-foreground mt-2 max-w-md">
                  Get started by creating your first project
                </p>
                <Button onClick={() => navigate('/projects/new')} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" /> Create Project
                </Button>
              </>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default Projects;
