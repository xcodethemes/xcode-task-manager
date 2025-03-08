
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Priority } from '@/contexts/TaskContext';
import { getPriorityLabel } from '@/lib/data';
import { ArrowUp, ArrowRight, ArrowDown } from 'lucide-react';

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
  showIcon?: boolean;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ 
  priority, 
  className,
  showIcon = true
}) => {
  const getPriorityClasses = (priority: Priority): string => {
    switch (priority) {
      case 'low':
        return 'bg-task-low/10 text-task-low border-task-low/30';
      case 'medium':
        return 'bg-task-medium/10 text-task-medium border-task-medium/30';
      case 'high':
        return 'bg-task-high/10 text-task-high border-task-high/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const PriorityIcon = () => {
    switch (priority) {
      case 'low':
        return <ArrowDown className="h-3 w-3 mr-1" />;
      case 'medium':
        return <ArrowRight className="h-3 w-3 mr-1" />;
      case 'high':
        return <ArrowUp className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={cn(
        'rounded-md font-medium transition-all flex items-center',
        getPriorityClasses(priority),
        className
      )}
    >
      {showIcon && <PriorityIcon />}
      {getPriorityLabel(priority)}
    </Badge>
  );
};
