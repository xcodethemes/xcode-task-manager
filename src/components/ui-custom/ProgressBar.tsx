
import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'default' | 'success' | 'warning' | 'danger';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  className,
  showLabel = true,
  size = 'md',
  color = 'default',
}) => {
  const percentage = Math.round((value / max) * 100);

  const getHeightBySize = (size: 'sm' | 'md' | 'lg'): string => {
    switch (size) {
      case 'sm':
        return 'h-1.5';
      case 'md':
        return 'h-2';
      case 'lg':
        return 'h-3';
    }
  };

  const getColorClass = (color: 'default' | 'success' | 'warning' | 'danger'): string => {
    switch (color) {
      case 'default':
        return 'bg-primary';
      case 'success':
        return 'bg-status-done';
      case 'warning':
        return 'bg-status-review';
      case 'danger':
        return 'bg-task-high';
    }
  };

  return (
    <div className={cn('w-full space-y-1', className)}>
      <div className="flex justify-between">
        {showLabel && (
          <span className="text-xs font-medium text-muted-foreground">
            Progress
          </span>
        )}
        <span className="text-xs font-medium">{percentage}%</span>
      </div>
      <div className={cn('w-full bg-secondary rounded-full overflow-hidden', getHeightBySize(size))}>
        <div
          className={cn('transition-all duration-500 ease-in-out rounded-full', getColorClass(color))}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
