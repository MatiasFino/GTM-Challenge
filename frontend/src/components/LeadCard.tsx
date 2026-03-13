import React from 'react';
import { cn } from '../lib/utils';

interface LeadCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export default function LeadCard({ children, className, hoverEffect = true, ...props }: LeadCardProps) {
  return (
    <div
      className={cn(
        "bg-navy-800 rounded-xl border border-navy-700 shadow-xl overflow-hidden",
        hoverEffect && "transition duration-300 hover:border-electric-blue/50 hover:shadow-electric-blue/10 hover:-translate-y-1 hover:shadow-2xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
