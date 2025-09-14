import * as React from 'react'; import { cn } from '@/lib/cn';
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div className={cn('rounded-3xl border border-white/10 bg-white/5', className)} {...props}/>; }
export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div className={cn('p-4', className)} {...props}/>; }
