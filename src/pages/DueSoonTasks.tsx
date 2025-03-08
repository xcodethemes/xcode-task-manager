
import React, { useState } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { TaskCard } from '@/components/ui-custom/TaskCard';
import { Pagination } from '@/components/ui-custom/Pagination';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  Loader2, 
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const DueSoonTasks = () => {
  const { tasks, projects, employees, isLoading, currentUser, isAdmin } = useTaskContext();
  const navigate = useNavigate();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 12;
  
  // Get tasks due soon (within 7 days)
  const now = new Date();
  const in7Days = new Date();
  in7Days.setDate(now.getDate() + 7);
  
  // Filter tasks based on user role
  let filteredTasks = isAdmin() 
    ? tasks 
    : (currentUser ? tasks.filter(t => t.assigneeId === currentUser.id) : []);
  
  // Filter tasks due soon
  const dueSoonTasks = filteredTasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    return dueDate > now && dueDate <= in7Days && task.status !== 'done';
  });
  
  // Sort by due date (earliest first)
  dueSoonTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  
  // Pagination logic
  const totalPages = Math.ceil(dueSoonTasks.length / tasksPerPage);
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = dueSoonTasks.slice(indexOfFirstTask, indexOfLastTask);
  
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
          <h1 className="text-2xl font-bold tracking-tight flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/')}
              className="mr-2 -ml-3"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            Tasks Due Soon
          </h1>
          <p className="text-muted-foreground">
            Tasks that are due within the next 7 days
          </p>
        </div>
      </div>

      {/* Task grid */}
      <div>
        {dueSoonTasks.length > 0 ? (
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
            <div className={cn(
              "h-20 w-20 rounded-full flex items-center justify-center",
              "bg-success/10 text-success mb-2"
            )}>
              <Calendar className="h-10 w-10" />
            </div>
            <h3 className="mt-2 text-lg font-medium">You're all caught up!</h3>
            <p className="text-muted-foreground mt-2 max-w-md">
              There are no tasks due in the next 7 days
            </p>
            <Button onClick={() => navigate('/tasks')} className="mt-4">
              View All Tasks
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DueSoonTasks;
