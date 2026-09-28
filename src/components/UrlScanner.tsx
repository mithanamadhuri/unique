import React, { useState } from 'react';
import { analyzeUrl } from '../engine/urlAnalyzer';
import { runDetectionPipeline } from '../engine/detectionPipeline';
import { ScanResult, UrlSecurityReport } from '../types/scam';
import { RiskBadge } from './RiskBadge';
import {
  Link2,
  Send,
  Loader2,
  Trash2,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Lock,
  Unlock,
  Globe,
  RotateCcw,
} from 'lucide-react';

interface UrlScannerProps {
  onScanComplete?: (result: ScanResult) => void;
}

export const UrlScanner: React.FC<UrlScannerProps> = ({ onScanComplete }) => {
  const [inputUrl, setInputUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<UrlSecurityReport | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);

  const demoUrls = [
    { label: 'Fake Banking Phishing', url: 'http://sbi-kyc-update.xyz/login-pan-verify.php' },
    { label: 'Suspicious IP-based URL', url: 'http://192.168.1.155/paypal-auth/secure-token' },
    { label: 'Shortened Link with Subdomains', url: 'https://tinyurl.com/bank-urgent-kyc-verify' },
    { label: 'Netflix Credential Harvester', url: 'http://netflix-billing-renew-account.top/pay' },
    { label: 'Safe Official Banking Portal', url: 'https://onlinesbi.sbi' },
  ];

  const handleAnalyze = async (urlToScan?: string) => {
    const url = (urlToScan !== undefined ? urlToScan : inputUrl).trim();
    if (!url) return;

    setLoading(true);

    try {
      // Analyze using backend endpoint
      const response = await fetch('/api/analyze-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
        setReport(data.url_security_report || analyzeUrl(url));
        if (onScanComplete) onScanComplete(data);
      } else {
        // Fallback
        const rep = analyzeUrl(url);
        const res = runDetectionPipeline(url, { scanType: 'url' });
        setReport(rep);
        setResult(res);
        if (onScanComplete) onScanComplete(res);
      }
    } catch {
      // Fallback
      const rep = analyzeUrl(url);
      const res = runDetectionPipeline(url, { scanType: 'url' });
      setReport(rep);
      setResult(res);
      if (onScanComplete) onScanComplete(res);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setInputUrl('');
    setReport(null);
    setResult(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400">
          <Link2 className="w-4 h-4 text-cyan-400" />
          <span>Safe URL Inspection Engine</span>
        </div>
        <h2 className="text-2xl font-bold text-white mt-1">Check a suspicious URL</h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Safely analyzes domain entropy, certificate protocols, TLD reputation, IP addresses, and credential harvesting paths <strong>without visiting the destination</strong>.
        </p>
      </div>

      {!report ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xl space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-slate-400 font-semibold">
              Destination URL
            </label>
            <div className="relative">
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Paste URL here (e.g. http://sbi-kyc-verify.top/login-portal)..."
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg px-4 py-3 text-sm sm:text-base text-slate-100 placeholder-slate-500 font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Quick Demo URLs */}
          <div>
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
              Try Sample URLs:
            </div>
            <div className="flex flex-wrap gap-2">
              {demoUrls.map((demo, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setInputUrl(demo.url);
                    handleAnalyze(demo.url);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-xs text-slate-300 font-mono transition-colors"
                >
                  {demo.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            {inputUrl && (
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
            <div className="ml-auto">
              <button
                type="button"
                disabled={!inputUrl.trim() || loading}
                onClick={() => handleAnalyze()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:pointer-events-none text-white text-sm font-semibold shadow-md shadow-cyan-950/50 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Decomposing URL...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Analyze URL</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* URL Security Report */
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-2xl space-y-6 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
                URL Security Report
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mt-1 break-all font-mono">
                {report.url}
              </h3>
            </div>

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-cyan-400 bg-cyan-950/40 hover:bg-cyan-900/40 rounded-lg border border-cyan-800/60 transition-colors self-start sm:self-auto shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Check Another URL</span>
            </button>
          </div>

          {/* Large Risk Badge */}
          <RiskBadge score={report.risk_score} level={report.risk_level} size="lg" />

          {/* Key URL Properties Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 uppercase">
                {report.protocol === 'https' ? (
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Unlock className="w-3.5 h-3.5 text-red-400" />
                )}
                <span>Protocol</span>
              </div>
              <div className="text-sm font-bold font-mono text-white mt-1 uppercase">
                {report.protocol}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-[11px] font-mono text-slate-400 uppercase">IP Address Host</div>
              <div className={`text-sm font-bold font-mono mt-1 ${report.is_ip_address ? 'text-red-400' : 'text-emerald-400'}`}>
                {report.is_ip_address ? 'DETECTED' : 'STANDARD'}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Shortened URL</div>
              <div className={`text-sm font-bold font-mono mt-1 ${report.is_shortened ? 'text-amber-400' : 'text-emerald-400'}`}>
                {report.is_shortened ? 'YES (SHORT)' : 'NO'}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Subdomains</div>
              <div className="text-sm font-bold font-mono text-white mt-1">
                {report.subdomain_count} Level{report.subdomain_count !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Indicators List */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold mb-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Suspicious URL Indicators Detected:</span>
            </h4>

            {report.indicators.length > 0 ? (
              <div className="space-y-2">
                {report.indicators.map((ind, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-slate-200 flex items-start gap-2.5"
                  >
                    <span className="text-red-400 font-bold font-mono shrink-0">⚠</span>
                    <span>{ind}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-xs sm:text-sm text-emerald-300 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>No high-risk domain anomalies, IP targets, or credential collection paths found.</span>
              </div>
            )}
          </div>

          {/* Security Recommendation */}
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold mb-1">
              Defensive Recommendation
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {report.recommendation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
