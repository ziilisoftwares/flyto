import * as React from 'react'; import { cn } from '@/lib/cn';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'default'|'secondary' }
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant='default', ...props }, ref) => {
  const base='inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition-colors';
  const variants={ default:'bg-white text-black hover:bg-white/90', secondary:'bg-white/10 text-white hover:bg-white/20'};
  return <button ref={ref} className={cn(base, variants[variant], className)} {...props}/>;
}); Button.displayName='Button';
