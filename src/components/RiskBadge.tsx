import React from 'react';
import { RiskLevel } from '../types/scam';
import { ShieldCheck, ShieldAlert, AlertTriangle, AlertOctagon, CheckCircle2 } from 'lucide-react';

interface RiskBadgeProps {
  score: number;
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  score,
  level,
  size = 'md',
  showIcon = true,
}) => {
  const getColors = () => {
    switch (level) {
      case 'CRITICAL':
        return {
          bg: 'bg-red-950/60 border-red-500/40 text-red-400',
          accent: 'text-red-500',
          bar: 'bg-red-500',
          icon: AlertOctagon,
        };
      case 'HIGH':
        return {
          bg: 'bg-orange-950/60 border-orange-500/40 text-orange-400',
          accent: 'text-orange-500',
          bar: 'bg-orange-500',
          icon: AlertTriangle,
        };
      case 'MEDIUM':
        return {
          bg: 'bg-amber-950/60 border-amber-500/40 text-amber-400',
          accent: 'text-amber-500',
          bar: 'bg-amber-500',
          icon: ShieldAlert,
        };
      case 'LOW':
        return {
          bg: 'bg-blue-950/60 border-blue-500/40 text-blue-400',
          accent: 'text-blue-400',
          bar: 'bg-blue-400',
          icon: ShieldCheck,
        };
      case 'SAFE':
      default:
        return {
          bg: 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400',
          accent: 'text-emerald-400',
          bar: 'bg-emerald-400',
          icon: CheckCircle2,
        };
    }
  };

  const { bg, bar, icon: Icon } = getColors();

  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border text-xs font-medium font-mono tabular-nums ${bg}`}>
        {showIcon && <Icon className="w-3.5 h-3.5 shrink-0" />}
        <span>{level} ({score})</span>
      </span>
    );
  }

  if (size === 'lg') {
    return (
      <div className={`p-4 rounded-xl border ${bg} flex items-center justify-between gap-4`}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <Icon className="w-8 h-8 shrink-0" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold opacity-75">Assessed Threat Level</div>
            <div className="text-xl font-bold tracking-tight">{level} RISK</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-extrabold font-mono tabular-nums tracking-tight">
            {score}<span className="text-base text-slate-400 font-normal">/100</span>
          </div>
          <div className="w-28 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1.5 ml-auto">
            <div className={`h-full rounded-full ${bar}`} style={{ width: `${score}%` }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-md border text-sm font-medium font-mono tabular-nums ${bg}`}>
      {showIcon && <Icon className="w-4 h-4 shrink-0" />}
      <span className="font-semibold">{level}</span>
      <span className="text-slate-400">·</span>
      <span>{score}/100</span>
    </span>
  );
};
