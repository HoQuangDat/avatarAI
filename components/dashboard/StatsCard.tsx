import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
}

export default function StatsCard({ title, value, change, icon: Icon, trend = 'neutral' }: StatsCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-brand-500/30 hover:shadow-lg hover:shadow-brand-500/5">
      {/* Gradient background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {change && (
            <p
              className={cn(
                'text-xs mt-2 flex items-center gap-1',
                trend === 'up' && 'text-emerald-400',
                trend === 'down' && 'text-red-400',
                trend === 'neutral' && 'text-slate-400'
              )}
            >
              {trend === 'up' && '↑'}
              {trend === 'down' && '↓'}
              {change}
            </p>
          )}
        </div>
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 group-hover:bg-brand-500/20 transition-colors">
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
