
import React from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { StatusBadge } from './StatusBadge';
import { ProgressBar } from './ProgressBar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Project, Task, Employee } from '@/contexts/TaskContext';
import { cn } from '@/lib/utils';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface ProjectCardProps {
  project: Project;
  tasks: Task[];
  employees: Employee[];
  onClick?: () => void;
  className?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  tasks,
  employees,
  onClick,
  className,
}) => {
  // Calculate project progress based on completed tasks
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  
  // Get team members for this project
  const teamMembers = employees.filter(emp => project.teamIds.includes(emp.id));
  
  // Get progress color based on completion percentage
  const getProgressColor = () => {
    const percentage = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
    if (percentage >= 75) return 'success';
    if (percentage >= 40) return 'default';
    if (percentage >= 20) return 'warning';
    return 'danger';
  };

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
        className
      )}
    >
      <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between">
        <div className="space-y-1">
          <p className="font-medium text-balance">{project.name}</p>
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            <span>
              {format(new Date(project.startDate), 'MMM d, yyyy')} - {format(new Date(project.endDate), 'MMM d, yyyy')}
            </span>
          </div>
        </div>
        
        <StatusBadge status={project.status} />
      </CardHeader>
      
      <CardContent className="px-4 py-2">
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
          {project.description}
        </p>
        
        <div className="mt-4">
          <ProgressBar 
            value={completedTasks} 
            max={totalTasks || 1} 
            color={getProgressColor()}
          />
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-2 flex justify-between items-center">
        <div className="flex -space-x-2">
          {teamMembers.slice(0, 4).map((member) => (
            <Avatar key={member.id} className="h-7 w-7 border-2 border-background">
              <AvatarImage src={member.avatar} />
              <AvatarFallback className="text-xs">{getInitials(member.name)}</AvatarFallback>
            </Avatar>
          ))}
          {teamMembers.length > 4 && (
            <Avatar className="h-7 w-7 border-2 border-background">
              <AvatarFallback className="text-xs bg-muted">+{teamMembers.length - 4}</AvatarFallback>
            </Avatar>
          )}
        </div>
        
        <div className="text-sm text-muted-foreground">
          {completedTasks}/{totalTasks} tasks
        </div>
      </CardFooter>
    </Card>
  );
};
