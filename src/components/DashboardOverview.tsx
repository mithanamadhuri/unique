import React from 'react';
import { ThreatAnalyticsData, ScanHistoryRecord } from '../types/scam';
import { RiskBadge } from './RiskBadge';
import {
  MessageSquareWarning,
  Link2,
  QrCode,
  Image as ImageIcon,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Activity,
  ArrowRight,
  Flame,
  AlertOctagon,
  ExternalLink,
} from 'lucide-react';

interface DashboardOverviewProps {
  analytics: ThreatAnalyticsData;
  recentScans: ScanHistoryRecord[];
  onNavigate: (tab: string) => void;
  onSelectRecord: (record: ScanHistoryRecord) => void;
  onSelectDemo: (text: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  analytics,
  recentScans,
  onNavigate,
  onSelectRecord,
  onSelectDemo,
}) => {
  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 p-6 sm:p-8">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 text-xs font-mono font-semibold uppercase">
            <span>SOC Defense Active</span>
            <span>·</span>
            <span>Zero-Trust Inspection</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Threat Detection Command Center
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Multi-signal explainable detection active across SMS, WhatsApp, payment handles, web hyperlinks, and QR targets. <strong>Know the Risk Before You Click.</strong>
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('scan-message')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs sm:text-sm shadow-md transition-all"
            >
              <MessageSquareWarning className="w-4 h-4" />
              <span>Scan Suspicious Message</span>
            </button>

            <button
              onClick={() => onNavigate('scan-url')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700 transition-all"
            >
              <Link2 className="w-4 h-4 text-cyan-400" />
              <span>Inspect URL</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Big Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase font-semibold">Total Audits</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white mt-2 tabular-nums">
            {analytics.total_scans}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Multi-modal scans logged</div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase font-semibold">Threats Intercepted</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-red-400 mt-2 tabular-nums">
            {analytics.threats_detected}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Confirmed fraud signatures</div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase font-semibold">Safe Verified</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 mt-2 tabular-nums">
            {analytics.safe_messages}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Legitimate communications</div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase font-semibold">Average Threat Score</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400 mt-2 tabular-nums">
            {analytics.avg_risk_score}<span className="text-xs text-slate-400 font-normal">/100</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Global risk calibration</div>
        </div>
      </div>

      {/* 4 Tool Cards Grid */}
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-3">
          Select Inspection Vector
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => onNavigate('scan-message')}
            className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-600/70 cursor-pointer transition-all hover:shadow-lg group"
          >
            <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-800/40 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <MessageSquareWarning className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
              Scan Message
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Analyze SMS, WhatsApp texts, OTP requests, and recruitment offers.
            </p>
          </div>

          <div
            onClick={() => onNavigate('scan-url')}
            className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-600/70 cursor-pointer transition-all hover:shadow-lg group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-950 border border-blue-800/40 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Link2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
              Scan URL
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Safely inspect hyperlinks without execution or visiting dangerous servers.
            </p>
          </div>

          <div
            onClick={() => onNavigate('scan-qr')}
            className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-600/70 cursor-pointer transition-all hover:shadow-lg group"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-950 border border-amber-800/40 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <QrCode className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
              Scan QR Code
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Extract and test payloads before scanning with mobile cameras.
            </p>
          </div>

          <div
            onClick={() => onNavigate('scan-screenshot')}
            className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-600/70 cursor-pointer transition-all hover:shadow-lg group"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-800/40 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <ImageIcon className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
              Screenshot Scanner
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Extract text from image snips and evaluate complete fraud context.
            </p>
          </div>
        </div>
      </div>

      {/* Circulating Threat Alert Banner */}
      <div className="p-5 rounded-xl bg-red-950/20 border border-red-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-red-950 text-red-400 border border-red-800/50 mt-0.5">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-red-400 font-bold">Active Threat Alert</span>
              <span className="text-slate-400">·</span>
              <span className="text-xs text-slate-300">Spike in Bank KYC SMS Suspensions</span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Coordinated phishing campaign spoofing major Indian and multinational banks claiming accounts are locked due to pending PAN/Aadhaar re-KYC.
            </p>
          </div>
        </div>

        <button
          onClick={() => onSelectDemo('KYC expires today. Click this link and enter your OTP.')}
          className="px-3.5 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800/60 border border-red-700/60 text-xs font-semibold text-red-200 transition-colors whitespace-nowrap self-start md:self-auto"
        >
          Test KYC Attack Sample →
        </button>
      </div>

      {/* Recent Scans Table Preview */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Recent Security Audits</h3>
            <p className="text-xs text-slate-400 mt-0.5">Latest scans performed across all channels</p>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>View All History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-2.5">Date</th>
                <th className="px-4 py-2.5">Type</th>
                <th className="px-4 py-2.5">Category</th>
                <th className="px-4 py-2.5">Risk Score</th>
                <th className="px-4 py-2.5">Severity</th>
                <th className="px-4 py-2.5">Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {recentScans.slice(0, 5).map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onSelectRecord(row)}
                  className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-2.5 font-mono text-slate-400 whitespace-nowrap">{row.date}</td>
                  <td className="px-4 py-2.5 font-mono text-slate-300 whitespace-nowrap">{row.scan_type}</td>
                  <td className="px-4 py-2.5 font-medium text-white whitespace-nowrap">{row.category}</td>
                  <td className="px-4 py-2.5 font-mono font-bold text-white tabular-nums">
                    {row.risk_score}<span className="text-[10px] text-slate-400 font-normal">/100</span>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <RiskBadge score={row.risk_score} level={row.risk_level} size="sm" />
                  </td>
                  <td className="px-4 py-2.5 font-mono text-slate-400 max-w-xs truncate">
                    {row.preview}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
