
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Status } from '@/contexts/TaskContext';
import { getStatusLabel } from '@/lib/data';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusClasses = (status: Status): string => {
    switch (status) {
      case 'todo':
        return 'bg-status-todo/10 text-foreground border-status-todo/30';
      case 'in-progress':
        return 'bg-status-in-progress/10 text-status-in-progress border-status-in-progress/30';
      case 'review':
        return 'bg-status-review/10 text-status-review/90 border-status-review/30';
      case 'done':
        return 'bg-status-done/10 text-status-done border-status-done/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={cn(
        'rounded-md font-medium transition-all',
        getStatusClasses(status),
        className
      )}
    >
      {getStatusLabel(status)}
    </Badge>
  );
};
