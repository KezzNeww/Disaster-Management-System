import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-xs border px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider font-semibold transition-colors focus:outline-none focus:ring-1 focus:ring-ring',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-blue-600/20 text-blue-400 border-blue-500/40',
        secondary:
          'border-transparent bg-slate-800 text-slate-300 border-slate-700',
        destructive:
          'border-transparent bg-red-950/40 text-red-400 border-red-500/40',
        success:
          'border-transparent bg-emerald-950/40 text-emerald-400 border-emerald-500/40',
        warning:
          'border-transparent bg-amber-950/40 text-amber-400 border-amber-500/40',
        telemetry:
          'border-transparent bg-sky-950/40 text-sky-400 border-sky-500/40',
        outline:
          'text-slate-300 border-slate-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
