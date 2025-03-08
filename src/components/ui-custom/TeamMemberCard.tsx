
import React from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Employee } from '@/contexts/TaskContext';
import { cn } from '@/lib/utils';
import { Briefcase, FileText, Mail } from 'lucide-react';

interface TeamMemberCardProps {
  employee: Employee;
  taskCount: number;
  projectCount: number;
  onClick?: () => void;
  className?: string;
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  employee,
  taskCount,
  projectCount,
  onClick,
  className,
}) => {
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
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 border border-border">
            <AvatarImage src={employee.avatar} />
            <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium line-clamp-1">{employee.name}</p>
            <p className="text-xs text-muted-foreground">{employee.role}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-4 py-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Mail className="h-3.5 w-3.5 mr-2" />
          <span className="truncate">{employee.email}</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-2 flex justify-between items-center text-sm">
        <div className="flex items-center">
          <FileText className="h-4 w-4 mr-1.5 text-primary/70" />
          <span>{taskCount} Tasks</span>
        </div>
        
        <div className="flex items-center">
          <Briefcase className="h-4 w-4 mr-1.5 text-primary/70" />
          <span>{projectCount} Projects</span>
        </div>
      </CardFooter>
    </Card>
  );
};
