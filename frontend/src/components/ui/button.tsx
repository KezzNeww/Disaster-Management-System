import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-sm text-xs font-medium tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 select-none uppercase font-mono',
  {
    variants: {
      variant: {
        default:
          'bg-blue-600 text-white shadow hover:bg-blue-700 active:bg-blue-800',
        destructive:
          'bg-red-500 text-white shadow-sm hover:bg-red-600 active:bg-red-700',
        outline:
          'border border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-slate-800 hover:border-slate-600',
        secondary:
          'bg-slate-800 text-slate-200 shadow-sm hover:bg-slate-700 active:bg-slate-800',
        ghost:
          'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100',
        telemetry:
          'border border-sky-500/30 bg-sky-950/20 text-sky-400 hover:bg-sky-900/30 hover:border-sky-400',
        success:
          'border border-emerald-500/30 bg-emerald-950/20 text-emerald-400 hover:bg-emerald-900/30 hover:border-emerald-400',
      },
      size: {
        default: 'h-8 px-3 py-1.5',
        sm: 'h-7 rounded-sm px-2 text-[11px]',
        lg: 'h-9 rounded-sm px-4',
        icon: 'h-8 w-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
