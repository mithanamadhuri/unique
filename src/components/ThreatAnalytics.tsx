import React, { useState } from 'react';
import { ThreatAnalyticsData, ScamCategory, RiskLevel } from '../types/scam';
import {
  BarChart3,
  TrendingUp,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Activity,
  Layers,
} from 'lucide-react';

interface ThreatAnalyticsProps {
  analytics: ThreatAnalyticsData;
}

export const ThreatAnalytics: React.FC<ThreatAnalyticsProps> = ({ analytics }) => {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number | null>(null);

  // Category breakdown colors
  const categoryColors = [
    '#ef4444', // red
    '#f97316', // orange
    '#f59e0b', // amber
    '#06b6d4', // cyan
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#10b981', // emerald
  ];

  const maxDailyScans = Math.max(...analytics.daily_scan_trends.map(d => d.scans), 35);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <span>Threat Intelligence & SOC Analytics</span>
        </div>
        <h2 className="text-2xl font-bold text-white mt-1">Threat Analytics Dashboard</h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Aggregated scan metrics, risk severity breakdowns, scam category distributions, and daily volume trends.
        </p>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400 font-semibold">Total Scans</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white mt-2 tabular-nums">
            {analytics.total_scans}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Across all input modalities</div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400 font-semibold">Threats Flagged</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-red-400 mt-2 tabular-nums">
            {analytics.threats_detected}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {analytics.total_scans > 0 ? Math.round((analytics.threats_detected / analytics.total_scans) * 100) : 0}% threat interception rate
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400 font-semibold">Benign / Safe</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-400 mt-2 tabular-nums">
            {analytics.safe_messages}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Verified safe communications</div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400 font-semibold">Average Risk</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-amber-400 mt-2 tabular-nums">
            {analytics.avg_risk_score}<span className="text-xs text-slate-400 font-normal">/100</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Global threat index</div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Threat Distribution by Category */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Threat Category Distribution</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Breakdown of active fraud and social engineering vectors
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {analytics.category_distribution.map((item, idx) => {
              const color = categoryColors[idx % categoryColors.length];
              return (
                <div
                  key={idx}
                  className="space-y-1 group cursor-pointer"
                  onMouseEnter={() => setActiveCategoryIndex(idx)}
                  onMouseLeave={() => setActiveCategoryIndex(null)}
                >
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-200 group-hover:text-cyan-400 transition-colors flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                      <span>{item.category}</span>
                    </span>
                    <span className="font-mono text-slate-400 tabular-nums">
                      {item.percentage}% ({item.count})
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(item.percentage, 4)}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Risk Level Distribution */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Risk Severity Distribution</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Proportion of threats across the 5 calibrated severity tiers
            </p>
          </div>

          <div className="grid grid-cols-5 gap-2 pt-4">
            {analytics.risk_distribution.map((item) => {
              const getLevelColor = (level: RiskLevel) => {
                switch (level) {
                  case 'CRITICAL': return 'bg-red-500 text-red-400 border-red-500/30';
                  case 'HIGH': return 'bg-orange-500 text-orange-400 border-orange-500/30';
                  case 'MEDIUM': return 'bg-amber-500 text-amber-400 border-amber-500/30';
                  case 'LOW': return 'bg-blue-500 text-blue-400 border-blue-500/30';
                  case 'SAFE': return 'bg-emerald-500 text-emerald-400 border-emerald-500/30';
                }
              };

              return (
                <div key={item.level} className="flex flex-col items-center justify-end h-48 space-y-2">
                  <div className="text-[11px] font-mono font-bold text-slate-300 tabular-nums">
                    {item.percentage}%
                  </div>
                  <div className="w-full bg-slate-950 rounded-lg p-1 h-32 flex items-end">
                    <div
                      className={`w-full rounded-md ${getLevelColor(item.level).split(' ')[0]} transition-all duration-500`}
                      style={{ height: `${Math.max(item.percentage, 8)}%` }}
                    />
                  </div>
                  <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold tracking-wider text-center">
                    {item.level}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Daily Scan Volume & Threat Trend Chart */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Daily Scan Volume & Threat Trajectory</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Weekly timeline comparing total activity against confirmed threats
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              <span>Total Scans</span>
            </span>
            <span className="flex items-center gap-1.5 text-red-400">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span>Threats Blocked</span>
            </span>
          </div>
        </div>

        {/* SVG Bar Chart */}
        <div className="pt-4 overflow-x-auto">
          <div className="min-w-[480px] h-48 flex items-end justify-between gap-4 px-2 pb-2 border-b border-slate-800">
            {analytics.daily_scan_trends.map((day, idx) => {
              const scanHeight = (day.scans / maxDailyScans) * 100;
              const threatHeight = (day.threats / maxDailyScans) * 100;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {day.threats}/{day.scans}
                  </div>
                  <div className="w-full flex items-end justify-center gap-1.5 h-36">
                    {/* Total Scans Bar */}
                    <div
                      className="w-1/2 max-w-[20px] bg-cyan-600/80 group-hover:bg-cyan-500 rounded-t-sm transition-all"
                      style={{ height: `${scanHeight}%` }}
                    />
                    {/* Threats Bar */}
                    <div
                      className="w-1/2 max-w-[20px] bg-red-600/80 group-hover:bg-red-500 rounded-t-sm transition-all"
                      style={{ height: `${threatHeight}%` }}
                    />
                  </div>
                  <div className="text-xs font-mono text-slate-400 font-semibold group-hover:text-white transition-colors">
                    {day.date}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
