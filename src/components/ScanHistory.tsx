import React, { useState } from 'react';
import { ScanHistoryRecord, RiskLevel } from '../types/scam';
import { RiskBadge } from './RiskBadge';
import {
  History,
  Search,
  Filter,
  Download,
  Trash2,
  ExternalLink,
  ShieldAlert,
  X,
  FileSpreadsheet,
} from 'lucide-react';

interface ScanHistoryProps {
  history: ScanHistoryRecord[];
  onClearHistory: () => void;
  onSelectRecord?: (record: ScanHistoryRecord) => void;
}

export const ScanHistory: React.FC<ScanHistoryProps> = ({
  history,
  onClearHistory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [selectedRecord, setSelectedRecord] = useState<ScanHistoryRecord | null>(null);

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel = levelFilter === 'ALL' || item.risk_level === levelFilter;
    const matchesType = typeFilter === 'ALL' || item.scan_type.toUpperCase() === typeFilter;

    return matchesSearch && matchesLevel && matchesType;
  });

  const handleExportCsv = () => {
    const headers = ['Date', 'Scan Type', 'Category', 'Risk Score', 'Risk Level', 'Preview', 'Recommended Action'];
    const rows = filteredHistory.map(item => [
      `"${item.date}"`,
      `"${item.scan_type}"`,
      `"${item.category}"`,
      item.risk_score,
      `"${item.risk_level}"`,
      `"${item.preview.replace(/"/g, '""')}"`,
      `"${item.recommended_action.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `scamshield_scan_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400">
            <History className="w-4 h-4 text-cyan-400" />
            <span>Audit Trail & Records</span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">Scan History</h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Persisted logs of analyzed messages, URLs, QR codes, and screenshots with threat scores.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <>
              <button
                onClick={handleExportCsv}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={onClearHistory}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-400 bg-red-950/40 hover:bg-red-900/40 rounded-lg border border-red-800/40 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search scans by text or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Risk Level Filter */}
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="bg-slate-950/80 border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
            <option value="SAFE">Safe</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-950/80 border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Types</option>
            <option value="MESSAGE">Message</option>
            <option value="URL">URL</option>
            <option value="QR">QR Code</option>
            <option value="SCREENSHOT">Screenshot</option>
          </select>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800 tracking-wider">
              <tr>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Risk Score</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold hidden md:table-cell">Preview</th>
                <th className="px-4 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-850/60 transition-colors cursor-pointer group"
                    onClick={() => setSelectedRecord(row)}
                  >
                    <td className="px-4 py-3 font-mono text-slate-400 whitespace-nowrap">
                      {row.date}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-300 whitespace-nowrap">
                      {row.scan_type}
                    </td>
                    <td className="px-4 py-3 font-medium text-white whitespace-nowrap">
                      {row.category}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-white tabular-nums">
                      {row.risk_score}
                      <span className="text-[11px] text-slate-400 font-normal">/100</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <RiskBadge score={row.risk_score} level={row.risk_level} size="sm" />
                    </td>
                    <td className="px-4 py-3 text-slate-400 max-w-xs truncate hidden md:table-cell font-mono text-xs">
                      {row.preview}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRecord(row);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-cyan-400 bg-cyan-950/40 hover:bg-cyan-900/40 rounded border border-cyan-800/50 transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    No scan records match the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Scan Record Details</h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono">
                <div>
                  <span className="text-slate-400 block text-[11px]">Timestamp:</span>
                  <span>{selectedRecord.date}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Scan Type:</span>
                  <span>{selectedRecord.scan_type}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] font-mono mb-1">Threat Assessment:</span>
                <div className="flex items-center gap-3">
                  <span className="text-base font-bold text-white">{selectedRecord.category}</span>
                  <RiskBadge score={selectedRecord.risk_score} level={selectedRecord.risk_level} size="sm" />
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] font-mono mb-1">Raw Input / URL:</span>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 break-all">
                  {selectedRecord.preview}
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] font-mono mb-1">Recommended Action:</span>
                <div className="p-3 rounded-lg bg-red-950/30 border border-red-800/40 text-xs text-red-200">
                  {selectedRecord.recommended_action}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
