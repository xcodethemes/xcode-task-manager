
import React from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Task, Employee } from '@/contexts/TaskContext';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar, CheckSquare, Clock } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  assignee: Employee | undefined;
  projectName: string;
  onClick?: () => void;
  className?: string;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  assignee,
  projectName,
  onClick,
  className,
}) => {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done';
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card 
      onClick={onClick}
      className={cn(
        'glass-card hover:translate-y-[-2px] cursor-pointer animate-scale-in',
        task.status === 'done' && 'opacity-80',
        className
      )}
    >
      <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between">
        <div className="space-y-1">
          <p className="font-medium line-clamp-1 text-balance">{task.title}</p>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <span className="line-clamp-1">{projectName}</span>
          </div>
        </div>
        
        <div className="flex space-x-2 pt-1">
          <StatusBadge status={task.status} />
        </div>
      </CardHeader>
      
      <CardContent className="px-4 py-2">
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
          {task.description}
        </p>
      </CardContent>
      
      <CardFooter className="p-4 pt-2 flex flex-col space-y-2">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6 border border-border">
              <AvatarImage src={assignee?.avatar} />
              <AvatarFallback className="text-xs">
                {assignee ? getInitials(assignee.name) : 'N/A'}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{assignee?.name || 'Unassigned'}</span>
          </div>
          <PriorityBadge priority={task.priority} />
        </div>
        
        <div className="flex items-center justify-between w-full text-xs text-muted-foreground pt-1">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span className={cn(isOverdue && 'text-task-high')}>
              {format(new Date(task.dueDate), 'MMM d, yyyy')}
            </span>
          </div>
          {task.status === 'done' ? (
            <div className="flex items-center">
              <CheckSquare className="h-3 w-3 mr-1 text-status-done" />
              <span>Completed</span>
            </div>
          ) : (
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>Due {isOverdue ? 'overdue' : 'soon'}</span>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
