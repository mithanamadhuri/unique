import React, { useState } from 'react';
import { ScanResult } from '../types/scam';
import { RiskBadge } from './RiskBadge';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  Copy,
  Check,
  RotateCcw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Cpu,
  Flame,
  KeyRound,
  DollarSign,
  Clock,
  HelpCircle,
} from 'lucide-react';

interface ScanResultCardProps {
  result: ScanResult;
  onReset: () => void;
  titlePrefix?: string;
}

export const ScanResultCard: React.FC<ScanResultCardProps> = ({
  result,
  onReset,
  titlePrefix = 'Analysis',
}) => {
  const [copied, setCopied] = useState(false);
  const [showTechnicalSignals, setShowTechnicalSignals] = useState(false);

  const handleCopyReport = () => {
    const text = `[ScamShield Live Report]
Threat Category: ${result.category}
Risk Score: ${result.risk_score} / 100 (${result.risk_level})
Explanation: ${result.explanation}
Recommended Action: ${result.recommended_action}
Indicators Found:
${result.indicators.map(i => `- ${i.name} (${i.score}%): ${i.explanation}`).join('\n')}
Timestamp: ${result.timestamp}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getIndicatorIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('urgency') || lower.includes('deadline')) return Clock;
    if (lower.includes('credential') || lower.includes('otp') || lower.includes('password')) return KeyRound;
    if (lower.includes('financial') || lower.includes('money') || lower.includes('upi') || lower.includes('fee')) return DollarSign;
    if (lower.includes('url') || lower.includes('link') || lower.includes('phishing')) return ExternalLink;
    if (lower.includes('coercion') || lower.includes('directive')) return Flame;
    return AlertTriangle;
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-2xl transition-all">
      {/* Header Banner */}
      <div className="p-6 border-b border-slate-800 bg-slate-950/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400">
              <span>{titlePrefix} Complete</span>
              <span>·</span>
              <span>Type: {result.scan_type.toUpperCase()}</span>
              <span>·</span>
              <span>{new Date(result.timestamp).toLocaleTimeString()}</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mt-1 flex items-center gap-2">
              <span>Category:</span>
              <span className="text-cyan-400 font-extrabold">{result.category}</span>
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyReport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 rounded-lg border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Report'}</span>
            </button>
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyan-400 bg-cyan-950/40 hover:bg-cyan-900/40 rounded-lg border border-cyan-800/60 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Scan Another</span>
            </button>
          </div>
        </div>

        {/* Large Risk Badge Display */}
        <div className="mt-5">
          <RiskBadge score={result.risk_score} level={result.risk_level} size="lg" />
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Simple Plain-English Explanation */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>Plain-Language Assessment</span>
          </div>
          <p className="text-slate-200 text-sm md:text-base leading-relaxed">
            {result.explanation}
          </p>
        </div>

        {/* "Why did ScamShield flag this?" Indicator Section */}
        {result.indicators.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Why did ScamShield flag this?</span>
              </h4>
              <span className="text-xs text-slate-400 font-mono">
                {result.indicators.length} threat signal{result.indicators.length !== 1 ? 's' : ''} detected
              </span>
            </div>

            <div className="space-y-3">
              {result.indicators.map((indicator, idx) => {
                const Icon = getIndicatorIcon(indicator.name);
                const isCritical = indicator.severity === 'critical';
                const isHigh = indicator.severity === 'high';

                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg bg-slate-950/40 border border-slate-800/90 hover:border-slate-700/80 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <div className={`p-1.5 rounded-md mt-0.5 ${
                          isCritical
                            ? 'bg-red-950/80 text-red-400 border border-red-800/50'
                            : isHigh
                            ? 'bg-orange-950/80 text-orange-400 border border-orange-800/50'
                            : 'bg-amber-950/80 text-amber-400 border border-amber-800/50'
                        }`}>
                          <Icon className="w-4 h-4 shrink-0" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                            <span>{indicator.name}</span>
                            <span className="text-xs font-mono text-slate-400">·</span>
                            <span className={`text-xs font-mono font-medium ${
                              isCritical ? 'text-red-400' : isHigh ? 'text-orange-400' : 'text-amber-400'
                            }`}>
                              {indicator.score}% Confidence
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 mt-1 leading-normal">
                            {indicator.explanation}
                          </p>
                        </div>
                      </div>

                      {/* Mini Bar */}
                      <div className="w-16 shrink-0 hidden sm:block">
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isCritical ? 'bg-red-500' : isHigh ? 'bg-orange-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${indicator.score}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recommended Action Card */}
        <div className={`p-5 rounded-lg border ${
          result.risk_level === 'CRITICAL' || result.risk_level === 'HIGH'
            ? 'bg-red-950/30 border-red-500/30'
            : result.risk_level === 'MEDIUM'
            ? 'bg-amber-950/30 border-amber-500/30'
            : 'bg-emerald-950/30 border-emerald-500/30'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className={`w-5 h-5 ${
              result.risk_level === 'CRITICAL' || result.risk_level === 'HIGH'
                ? 'text-red-400'
                : result.risk_level === 'MEDIUM'
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`} />
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Recommended Action
            </h4>
          </div>

          <p className="text-sm md:text-base font-medium text-slate-100 mb-3">
            {result.recommended_action}
          </p>

          <div className="pt-2 border-t border-slate-800/60 text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-bold">1.</span>
              <span>Do not panic or rush; artificial urgency is designed to disable critical thinking.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-bold">2.</span>
              <span>Verify through independent channels (official bank app, verified website, or in-person).</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-bold">3.</span>
              <span>Remember: ScamShield rule: <strong>STOP. SCAN. UNDERSTAND. THEN ACT.</strong></span>
            </div>
          </div>
        </div>

        {/* Collapsible Multi-Signal Technical Telemetry */}
        <div className="border-t border-slate-800 pt-4">
          <button
            onClick={() => setShowTechnicalSignals(!showTechnicalSignals)}
            className="w-full flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-200 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Multi-Signal Detection Weights</span>
            </span>
            {showTechnicalSignals ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showTechnicalSignals && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4 pt-3 border-t border-slate-800/60">
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-center">
                <div className="text-[10px] uppercase font-mono text-slate-400">Text Analysis</div>
                <div className="text-base font-bold font-mono text-cyan-400 mt-1 tabular-nums">
                  {result.signals.textScore}<span className="text-xs text-slate-400">/100</span>
                </div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-center">
                <div className="text-[10px] uppercase font-mono text-slate-400">URL Risk</div>
                <div className="text-base font-bold font-mono text-cyan-400 mt-1 tabular-nums">
                  {result.signals.urlScore}<span className="text-xs text-slate-400">/100</span>
                </div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-center">
                <div className="text-[10px] uppercase font-mono text-slate-400">Rule Match</div>
                <div className="text-base font-bold font-mono text-cyan-400 mt-1 tabular-nums">
                  {result.signals.ruleScore}<span className="text-xs text-slate-400">/100</span>
                </div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-center">
                <div className="text-[10px] uppercase font-mono text-slate-400">Social Eng.</div>
                <div className="text-base font-bold font-mono text-cyan-400 mt-1 tabular-nums">
                  {result.signals.socialEngineeringScore}<span className="text-xs text-slate-400">/100</span>
                </div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-center col-span-2 sm:col-span-1">
                <div className="text-[10px] uppercase font-mono text-slate-400">ML TF-IDF</div>
                <div className="text-base font-bold font-mono text-cyan-400 mt-1 tabular-nums">
                  {result.signals.mlScore}<span className="text-xs text-slate-400">/100</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
