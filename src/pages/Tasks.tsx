
import React, { useState } from 'react';
import { useTaskContext, Status, Priority } from '@/contexts/TaskContext';
import { TaskCard } from '@/components/ui-custom/TaskCard';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { PriorityBadge } from '@/components/ui-custom/PriorityBadge';
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
  Loader2,
  Plus,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Tasks = () => {
  const { tasks, projects, employees, isLoading } = useTaskContext();
  const navigate = useNavigate();
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [projectFilter, setProjectFilter] = useState<string | 'all'>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string | 'all'>('all');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 12;

  // Apply filters
  let filteredTasks = [...tasks];
  
  // Search filter
  if (searchQuery) {
    filteredTasks = filteredTasks.filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  // Status filter
  if (statusFilter !== 'all') {
    filteredTasks = filteredTasks.filter(task => task.status === statusFilter);
  }
  
  // Priority filter
  if (priorityFilter !== 'all') {
    filteredTasks = filteredTasks.filter(task => task.priority === priorityFilter);
  }
  
  // Project filter
  if (projectFilter !== 'all') {
    filteredTasks = filteredTasks.filter(task => task.projectId === projectFilter);
  }
  
  // Assignee filter
  if (assigneeFilter !== 'all') {
    filteredTasks = filteredTasks.filter(task => task.assigneeId === assigneeFilter);
  }
  
  // Sort by due date (most urgent first)
  filteredTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  
  // Pagination logic
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const resetFilters = () => {
    setStatusFilter('all');
    setPriorityFilter('all');
    setProjectFilter('all');
    setAssigneeFilter('all');
    setCurrentPage(1);
  };
  
  const isFiltering = statusFilter !== 'all' || priorityFilter !== 'all' || 
                    projectFilter !== 'all' || assigneeFilter !== 'all';

  if (isLoading) {
    return (
      <div className="w-full h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Manage and track all your tasks in one place
          </p>
        </div>
        <Button onClick={() => navigate('/tasks/new')}>
          <Plus className="h-4 w-4 mr-2" /> Add New Task
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Priority
                <ChevronDown className="h-4 w-4 ml-1 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {['all', 'low', 'medium', 'high'].map((priority) => (
                <DropdownMenuItem 
                  key={priority}
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setPriorityFilter(priority as Priority | 'all')}
                >
                  {priority === 'all' ? 'All Priorities' : (
                    <PriorityBadge priority={priority as Priority} />
                  )}
                  {priorityFilter === priority && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10">
                Project
                <ChevronDown className="h-4 w-4 ml-1 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by Project</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setProjectFilter('all')}
              >
                All Projects
                {projectFilter === 'all' && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </DropdownMenuItem>
              {projects.map((project) => (
                <DropdownMenuItem 
                  key={project.id}
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setProjectFilter(project.id)}
                >
                  <div className="truncate">{project.name}</div>
                  {projectFilter === project.id && (
                    <Check className="h-4 w-4 text-primary flex-shrink-0 ml-2" />
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

      {/* Task grid */}
      <div>
        {filteredTasks.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {currentTasks.map((task) => {
                const project = projects.find((p) => p.id === task.projectId);
                const assignee = employees.find((e) => e.id === task.assigneeId);

                return (
                  <TaskCard
                    key={task.id}
                    task={task}
                    assignee={assignee}
                    projectName={project?.name || 'Unknown Project'}
                    onClick={() => navigate(`/tasks/${task.id}`)}
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
                <h3 className="mt-4 text-lg font-medium">No matching tasks found</h3>
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
                  <Plus className="h-10 w-10" />
                </div>
                <h3 className="mt-2 text-lg font-medium">No tasks yet</h3>
                <p className="text-muted-foreground mt-2 max-w-md">
                  Get started by creating your first task
                </p>
                <Button onClick={() => navigate('/tasks/new')} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" /> Create Task
                </Button>
              </>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default Tasks;
