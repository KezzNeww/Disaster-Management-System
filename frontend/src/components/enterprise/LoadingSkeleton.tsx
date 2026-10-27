import React from 'react';
import { cn } from '../../utils/cn';

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
}

export function LoadingSkeleton({ className = 'h-6 w-full', count = 1 }: LoadingSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'animate-pulse rounded-xs bg-slate-800/60 border border-slate-700/30',
            className
          )}
        />
      ))}
    </>
  );
}
