import React from 'react';
import {
  LayoutDashboard,
  MessageSquareWarning,
  Link2,
  QrCode,
  Image as ImageIcon,
  History,
  BarChart3,
  BookOpenCheck,
  Info,
  ShieldCheck,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  threatsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onNavigate,
  threatsCount = 0,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'scan-message', label: 'Scan Message', icon: MessageSquareWarning },
    { id: 'scan-url', label: 'Scan URL', icon: Link2 },
    { id: 'scan-qr', label: 'Scan QR', icon: QrCode },
    { id: 'scan-screenshot', label: 'Screenshot Scanner', icon: ImageIcon },
    { id: 'history', label: 'Scan History', icon: History },
    { id: 'analytics', label: 'Threat Analytics', icon: BarChart3 },
    { id: 'tips', label: 'Security Tips', icon: BookOpenCheck },
    { id: 'about', label: 'About ScamShield', icon: Info },
  ];

  return (
    <aside className="w-full lg:w-64 bg-slate-950/80 border-b lg:border-b-0 lg:border-r border-slate-800 lg:min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between shrink-0">
      <div>
        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 px-3 mb-2 font-semibold">
          Navigation
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-800/50 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                </div>

                {item.id === 'history' && threatsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-red-950 text-red-400 border border-red-800/50">
                    {threatsCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Defensive Status Module */}
      <div className="mt-8 pt-4 border-t border-slate-900 hidden lg:block">
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-slate-200 font-semibold mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Detection Core</span>
          </div>
          <div className="space-y-1 font-mono text-[11px]">
            <div className="flex justify-between">
              <span>Rule Engine:</span>
              <span className="text-emerald-400">Online</span>
            </div>
            <div className="flex justify-between">
              <span>URL Guard:</span>
              <span className="text-emerald-400">Active</span>
            </div>
            <div className="flex justify-between">
              <span>ML Classifier:</span>
              <span className="text-cyan-400">TF-IDF v1.2</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
